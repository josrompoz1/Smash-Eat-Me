import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SesionService } from '../Services/sesion.service';

@Injectable()
export class ServerResponseInterceptor implements HttpInterceptor {

  private predicates: string[] = ['PUT', 'POST', 'DELETE'];

  constructor(private toastr: ToastrService, private sesionService: SesionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((evt: any) => {
        if(!request.url.includes('/productos') && !request.url.includes('valoraciones/producto/') 
            && !request.url.includes('productos/tipo/') && !request.url.includes('productos/busqueda/')
            && !request.url.includes('reto') && !request.url.includes('solucion')) {
          if(sessionStorage.getItem('token')) {
            const fecha = sessionStorage.getItem('fechaLogin')
            const fechaActual = +new Date()
            if(fecha) {
              if((fechaActual - +fecha) > 1800000) {
                this.sesionService.cerrarSesion()
                this.sesionService.redirectToLogin()
                this.toastr.info("La sesión ha caducado", 'Smash&Eat Me App')
              }
            }
          } else {
            this.sesionService.redirectToLogin()
          }
        }
        if(this.predicates.indexOf(request.method) >= 0 && evt instanceof HttpResponse && evt.status == 201) {
          let message: string = evt.body['status']
          if(message) {
            this.toastr.success(message, 'Smash&Eat Me App')
          }
        }
      }, (err: any) => {
        if(err instanceof HttpErrorResponse && err.status >= 400) {
          let message: string = err.error['status']
          if(message) {
            this.toastr.error(message, 'Smash&Eat Me App')
          }
        }
      })
    );
  }
}
