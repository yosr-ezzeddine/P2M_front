import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators'; 
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
import { SHA256 } from 'crypto-js';
import { enc } from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import { authenticator } from 'otplib';


export interface IUser {
  email: string;
  password: string;
  code: string;
  name?: string;
}

export interface ISharedUser {
  email: string;
  password: string;
}

interface DecodedToken {
  sub: string;
  email?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private cognitoUser: AuthUser | null = null;
  private sharedUser: ISharedUser | null = null;
  private authenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;
  private mfaSetupRequiredSubject = new BehaviorSubject<boolean>(false);
  public mfaSetupRequired$ = this.mfaSetupRequiredSubject.asObservable();

  constructor(private router: Router) {
    this.configureAmplify();
    this.authenticatedSubject = new BehaviorSubject<boolean>(false);
    this.isAuthenticated$ = this.authenticatedSubject.asObservable();
    this.checkAuthState().subscribe();
  }

  private configureAmplify(): void {
    const authConfig = {
      Cognito: {
        region: environment.cognito.region,
        userPoolId: environment.cognito.userPoolId,
        userPoolWebClientId: environment.cognito.userPoolClientId,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
        mfa: {
          status: 'optional',
          totpEnabled: true,
          smsEnabled: false
        },
        passwordFormat: {
          minLength: 12,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: true
        }
      }
    };
  }

  private checkAuthState(): Observable<boolean> {
    return from(getCurrentUser()).pipe(
      tap(user => {
        this.cognitoUser = user;
        this.authenticatedSubject.next(true);
      }),
      map(() => true),
      catchError(() => {
        this.authenticatedSubject.next(false);
        return of(false);
      })
    );
  }

  public signUp(user: IUser): Observable<SignUpOutput> {
    if (!user.name) {
      user.name = user.email;
    }

    return from(signUp({
      username: user.name,
      password: user.password,
      options: {
        userAttributes: {
          email: user.email
        },
        autoSignIn: false
      }
    })).pipe(
      catchError(error => {
        console.error('SignUp Error:', error);
        throw this.handleAuthError(error);
      })
    );
  }

  public confirmSignUp(user: IUser): Observable<any> {
    return from(confirmSignUp({
      username: user.name || user.email,
      confirmationCode: user.code
    })).pipe(
      catchError(error => {
        console.error('ConfirmSignUp Error:', error);
        throw this.handleAuthError(error);
      })
    );
  }

  public signIn(user: IUser): Observable<SignInOutput> {
    return from(signIn({
      username: user.email,
      password: user.password
    })).pipe(
      switchMap(async (response: SignInOutput) => {
        this.cognitoUser = await getCurrentUser();
        this.handleSignInNextSteps(response);
        return response;
      }),
      catchError(error => {
        console.error('SignIn Error:', error);
        throw this.handleAuthError(error);
      })
    );
  }

  private handleSignInNextSteps(signInResponse: SignInOutput): void {
    switch (signInResponse.nextStep?.signInStep) {
      case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
        this.router.navigate(['/otp']);
        break;
      case 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION':
        break;
      case 'DONE':
        this.authenticatedSubject.next(true);
        this.router.navigate(['/home']);
        break;
      default:
        console.warn('Unhandled signIn step:', signInResponse.nextStep?.signInStep);
    }
  }

  public confirmSignInWithMFA(otpCode: string): Observable<any> {
    return from(confirmSignIn({
      challengeResponse: otpCode
    })).pipe(
      tap(() => {
        this.authenticatedSubject.next(true);
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        console.error('ConfirmSignIn Error:', error);
        throw this.handleAuthError(error);
      })
    );
  }

  public signOut(): Observable<void> {
    return from(signOut({ global: true })).pipe(
      tap(() => {
        this.cognitoUser = null;
        this.authenticatedSubject.next(false);
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('SignOut Error:', error);
        throw this.handleAuthError(error);
      })
    );
  }

  public getCurrentUser(): Observable<AuthUser | null> {
    if (this.cognitoUser) {
      return of(this.cognitoUser);
    }
    return from(getCurrentUser()).pipe(
      tap(user => this.cognitoUser = user),
      catchError(() => of(null))
    );
  }

  public getIdToken(): Observable<string | null> {
    return from(fetchAuthSession()).pipe(
      map(session => session.tokens?.idToken?.toString() || null),
      catchError(() => of(null))
    );
  }

  public isAuthenticated(): Observable<boolean> {
    if (this.authenticatedSubject.value) {
      return of(true);
    }
    return this.getCurrentUser().pipe(
      map(user => !!user),
      tap(authenticated => this.authenticatedSubject.next(authenticated))
    );
  }

  public async setupTOTP(): Promise<string> {
    try {
      const { sharedSecret } = await setUpTOTP();
      const user = await getCurrentUser();
      const username = user.username || user.userId || 'unknown';
      return authenticator.keyuri(
        username,
        environment.appName,
        sharedSecret
      );
    } catch (error) {
      console.error('TOTP setup error:', error);
      throw new Error('Failed to setup TOTP');
    }
  }

  public verifyTOTPSetup(totpCode: string): Observable<void> {
    return this.confirmSignInWithMFA(totpCode).pipe(
      tap(() => this.mfaSetupRequiredSubject.next(false))
    );
  }

  public generateSecurePassword(idToken: string): string {
    try {
      const decodedToken = jwtDecode<DecodedToken>(idToken);
      if (!decodedToken.sub) throw new Error('Invalid token: missing sub claim');

      const hashedSub = SHA256(`${decodedToken.sub}:${environment.cognito.userPoolId}`)
        .toString(enc.Hex)
        .slice(0, 16);

      const array = new Uint8Array(8);
      crypto.getRandomValues(array);
      const randomPart = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
      let password = `${hashedSub}${randomPart}`;

      const requirements = [
        { test: /[A-Z]/, generator: this.getRandomUpperCase },
        { test: /[a-z]/, generator: this.getRandomLowerCase },
        { test: /\d/, generator: this.getRandomNumber },
        { test: /[^A-Za-z0-9]/, generator: this.getRandomSpecialCharacter }
      ];

      requirements.forEach(req => {
        if (!req.test.test(password)) password += req.generator();
      });

      while (password.length < 16) password += this.getRandomCharacter();
      return password.slice(0, 32);
    } catch (error) {
      console.error('Password generation error:', error);
      return this.generateRandomPassword();
    }
  }

  private generateRandomPassword(): string {
    const length = 16;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    password += this.getRandomUpperCase();
    password += this.getRandomLowerCase();
    password += this.getRandomNumber();
    password += this.getRandomSpecialCharacter();
    for (let i = password.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  private handleAuthError(error: any): Error {
    let message = 'Authentication error';
    if (typeof error === 'string') message = error;
    else if (error?.message) message = error.message;
    else if (error?.toString) message = error.toString();

    if (message.includes('Incorrect username or password')) message = 'Invalid email or password';
    else if (message.includes('User not confirmed')) message = 'Account not verified. Please check your email for verification code.';

    return new Error(message);
  }

  private getRandomUpperCase(): string { return String.fromCharCode(65 + Math.floor(Math.random() * 26)); }
  private getRandomLowerCase(): string { return String.fromCharCode(97 + Math.floor(Math.random() * 26)); }
  private getRandomNumber(): string { return String.fromCharCode(48 + Math.floor(Math.random() * 10)); }
  private getRandomSpecialCharacter(): string {
    const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    return specials.charAt(Math.floor(Math.random() * specials.length));
  }
  private getRandomCharacter(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }
}