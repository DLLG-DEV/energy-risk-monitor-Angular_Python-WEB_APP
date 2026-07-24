import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const requestClone = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(requestClone);
  }
  return next(req);
};
