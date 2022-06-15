import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ServerResponseInterceptor implements HttpInterceptor {

  private predicates: string[] = ['PUT', 'POST', 'DELETE'];

  constructor(private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((evt: any) => {
        if(this.predicates.indexOf(request.method) >= 0 && evt instanceof HttpResponse && (evt.status == 201 || evt.status == 204)) {
          let message: string = evt.body['status']
          if(message) {
            console.log(message)
            this.toastr.success(message, 'Smash&Eat Me App')
          }
        }
      })
    );
  }
}
