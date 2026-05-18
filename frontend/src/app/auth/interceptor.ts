import { Injectable } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpEvent,
  HttpHandler,
  HttpRequest, 
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor : HttpInterceptorFn = (req,next) => {
    const token = localStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next(cloned);
    } else {
      return next(req);
    }
    return next(req)
}


@Injectable()
export class AuthInterceptorModule implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log("-------------")
    console.log(token)
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}