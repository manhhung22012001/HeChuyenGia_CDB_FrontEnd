import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private tokenStorageService: TokenStorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this.tokenStorageService.getToken();
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