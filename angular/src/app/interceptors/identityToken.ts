import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, mergeMap } from 'rxjs';
import { SpinnerService } from '../services/spinner/spinner.service';

@Injectable()
export class IdentityTokenInterceptor implements HttpInterceptor {
  constructor(private spinner: SpinnerService, private auth: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.auth.getAccessTokenSilently().pipe(
      mergeMap((token) => {
        if (token) {
          const request = req.clone({
            headers: req.headers.append('Authorization', `Bearer ${token}`),
          });
          return next.handle(request);
        }
        return next.handle(req);
      })
    );
  }
}
