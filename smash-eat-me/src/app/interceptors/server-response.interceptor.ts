import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class ServerResponseInterceptor implements HttpInterceptor {

  private predicates: string[] = ['PUT', 'POST', 'DELETE'];

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((evt: any) => {
        if(this.predicates.indexOf(request.method) >= 0 && evt instanceof HttpResponse && (evt.status == 201 || evt.status == 204)) {
          let message: string = evt.body['status']
          if(message) {
            // this.mensajesComponent.element = true;
            // this.mensajesComponent.mensaje = message;
          }
        }
      })
    );
  }
}
