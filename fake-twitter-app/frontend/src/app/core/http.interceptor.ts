// src/app/core/http.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  // klónozd a requestet, hogy always küldje a cookie-t
  const withCredReq = req.clone({ withCredentials: true });
  return next(withCredReq);
};
