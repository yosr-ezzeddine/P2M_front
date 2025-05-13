import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Amplify } from 'aws-amplify';
import {
  signUp,
  confirmSignUp,
  signIn,
  confirmSignIn,
  signOut,
  getCurrentUser,
  setUpTOTP,
  fetchAuthSession,
  type AuthUser,
  type SignInOutput,
  type SignUpOutput
} from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { authenticator } from 'otplib';

export interface IUser {
  email: string;
  password: string;
  code?: string;
  name?: string;
  phoneNumber?: string;
}

export type MFAType = 'SMS' | 'TOTP';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private cognitoUser: AuthUser | null = null;
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.authenticatedSubject.asObservable();
  public mfaSetupRequired$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    this.configureAmplify();
    this.initializeAuthState();
  }

  private configureAmplify(): void {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: environment.cognito.userPoolId,
          userPoolClientId: environment.cognito.userPoolClientId,
          loginWith: { email: true },
          mfa: {
            smsEnabled: true,  // Correct property name
            totpEnabled: true  // Correct property name
          }
        }
      }
    });
  }
  private initializeAuthState(): void {
    from(getCurrentUser()).pipe(
      tap(user => {
        this.cognitoUser = user;
        this.authenticatedSubject.next(true);
      }),
      catchError(() => {
        this.authenticatedSubject.next(false);
        return of(null);
      })
    ).subscribe();
  }

  public signUp(user: {
    email: string,
    password: string,
    name: string,
    phoneNumber?: string,
    customAttributes?: Record<string, string>
  }): Observable<SignUpOutput> {
    return from(signUp({
      username: user.email,
      password: user.password,
      options: {
        userAttributes: {
          email: user.email,
          name: user.name,
          phone_number: user.phoneNumber ? `+216${user.phoneNumber}` : undefined,
          ...(user.customAttributes || {})
        },
        autoSignIn: false
      }
    })).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }

  public confirmSignUp(user: IUser): Observable<any> {
    return from(confirmSignUp({
      username: user.email,
      confirmationCode: user.code!
    })).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }

  public signIn(user: IUser): Observable<SignInOutput> {
    return from(signIn({
      username: user.email,
      password: user.password
    })).pipe(
      switchMap(async (response) => {
        this.cognitoUser = await getCurrentUser();

        switch (response.nextStep?.signInStep) {
          case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
            this.router.navigate(['/confirm-mfa'], {
              state: {
                type: 'SMS',
                destination: response.nextStep.codeDeliveryDetails?.destination
              }
            });
            break;

          case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
            this.router.navigate(['/confirm-mfa'], {
              state: { type: 'TOTP' }
            });
            break;

          case 'DONE':
            this.authenticatedSubject.next(true);
            this.router.navigate(['/home']);
            break;
        }
        return response;
      }),
      catchError(error => this.handleAuthError(error))
    );
  }

  public confirmMFACode(code: string, type: MFAType): Observable<any> {
    return from(confirmSignIn({ challengeResponse: code })).pipe(
      tap(async () => {
        this.cognitoUser = await getCurrentUser();
        this.authenticatedSubject.next(true);
        this.router.navigate(['/home']);
      }),
      catchError(error => this.handleAuthError(error))
    );
  }


  public resendSMSCode(): Promise<void> {
    return signIn({
      username: this.cognitoUser?.username || '',
      password: '' // Password not needed for resend
    }).then(response => {
      if (response.nextStep?.signInStep !== 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        throw new Error('Failed to trigger SMS resend');
      }
    });
  }

  public async setupTOTP(): Promise<string> {
    try {
      const { sharedSecret } = await setUpTOTP();
      const user = await getCurrentUser();
      return authenticator.keyuri(
        user.username || user.userId || 'user',
        environment.appName,
        sharedSecret
      );
    } catch (error) {
      console.error('TOTP setup error:', error);
      throw new Error('Failed to setup TOTP');
    }
  }

  public verifyTOTPSetup(totpCode: string): Observable<void> {
    return this.confirmMFACode(totpCode, 'TOTP').pipe(
      tap(() => this.mfaSetupRequired$.next(false))
    );
  }

  public signOut(): Observable<void> {
    return from(signOut()).pipe(
      tap(() => {
        this.cognitoUser = null;
        this.authenticatedSubject.next(false);
        this.router.navigate(['/login']);
      }),
      catchError(error => this.handleAuthError(error))
    );
  }

  public getCurrentUser(): Observable<AuthUser | null> {
    return this.cognitoUser
      ? of(this.cognitoUser)
      : from(getCurrentUser()).pipe(
        tap(user => this.cognitoUser = user),
        catchError(() => of(null))
      );
  }

  public fetchAuthSession(): Observable<any> {
    return from(fetchAuthSession()).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }

  private handleAuthError(error: any): Observable<never> {
    console.error('Auth Error:', error);
    let message = 'Authentication failed';

    if (error.message) {
      if (error.message.includes('Incorrect username or password')) {
        message = 'Invalid email or password';
      } else if (error.message.includes('User not confirmed')) {
        message = 'Please verify your email first';
      } else {
        message = error.message;
      }
    }

    throw new Error(message);
  }
}