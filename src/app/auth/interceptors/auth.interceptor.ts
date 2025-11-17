import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Obtener el TOKEN del localStorage
    const token = localStorage.getItem('token');
    
    console.log('🔐 Interceptor - Token encontrado:', !!token);
    console.log('🔐 URL:', req.url);

    // Si hay token, agregarlo al header
    if (token) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedReq);
    }

    return next(req);
};