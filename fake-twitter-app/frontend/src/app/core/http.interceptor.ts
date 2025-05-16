import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const withCredReq = req.clone({ withCredentials: true });
  return next(withCredReq);
};
