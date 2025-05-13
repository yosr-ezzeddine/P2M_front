import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators'; // Removed unused 'map'
import { CognitoService } from './cognito.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private cognitoService: CognitoService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.cognitoService.isAuthenticated$.pipe(
      switchMap(authenticated => {
        if (authenticated) {
          return of(true);
        } else {
          return of(this.router.createUrlTree(['/login']));
        }
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}