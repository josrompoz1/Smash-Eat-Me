import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CuponDescuento, Login, ProductoOfertado, Usuario, Valoracion } from '../Models/types';
import { RetosService } from '../Services/retos.service';
import { DataManagementService } from '../Services/data-management.service';

@Injectable()
export class ChallengesInterceptor implements HttpInterceptor {

  private predicates: string[] = ['POST'];

  constructor(private retosService: RetosService, private dataManagement: DataManagementService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(async (evt: any) => {
        //RETO LOGIN, FUERZA BRUTA, VISUALIZA UNA CONTRASEÑA y CREDENCIALES
        if(request.url.includes("/signin")) {
          const login: Login = (request.body as Login)
          if(login.username == 'perico' && (login.contrasena.includes("' OR '") || login.contrasena.includes("' or '")) && login.contrasena.includes("'='")) {
            await this.retosService.finishReto(1)
          } else if(login.username == 'admin' && login.contrasena == 'password') {
            await this.retosService.finishReto(10)
          } else if(login.username == 'perico' && login.contrasena == 'asd1234') {
            await this.retosService.finishReto(14)
          } else if(login.username == 'user7' && login.contrasena == 'htr23fgjm') {
            await this.retosService.finishReto(13)
          }
        } 
        //RETO XSS REFLEJADO
        else if(request.url.includes("/productos/busqueda/") || (request.url.includes("/productos/") && request.url.includes("/busqueda/"))) {
          const urlSplit: string[] = request.url.split("/")
          const busqueda: string = urlSplit[urlSplit.length-1]
          if(busqueda.includes("<iframe src='javascript:") && busqueda.includes("'>")) {
            await this.retosService.finishReto(2)
          }
        }
        //RETO COOKIES DE USUARIO
        else if(request.url.includes("/productos/porId/") && evt instanceof HttpResponse) {
          const producto: ProductoOfertado = evt.body
          const imagen: string = producto.imagen
          if(imagen.includes("javascript:alert(") && imagen.includes("document.cookie") && imagen.includes(")")) {
            await this.retosService.finishReto(3)
          }
        }
        //RETO CUPON 100
        else if(request.url.includes("/cupones/codigo/") && evt instanceof HttpResponse) {
          const cupon: CuponDescuento[] = evt.body
          console.log(cupon)
          if(cupon[0].porcentaje) {
            const descuento: number = cupon[0].porcentaje
            console.log(descuento)
            if(descuento == 100) {
              await this.retosService.finishReto(9)
            }
          }
        }
        //RETO VALORACION DE 0
        else if(request.url.includes("/valoraciones") && request.method == 'POST') {
          const valoracion: Valoracion = (request.body as Valoracion)
          const puntuacion: number = valoracion.puntuacion
          if(puntuacion == 0) {
            await this.retosService.finishReto(4)
          }
        }
        //RETO USUARIO ADMIN
        else if(request.url.includes("usuarios") && request.method == 'POST') {
          const usuario: Usuario = (request.body as Usuario)
          if(usuario.tipo) {
            const rol: string = usuario.tipo
            if(rol == 'ADMIN') {
              await this.retosService.finishReto(5)
            }
          }
        }
        //RETO RESEÑA 5 ESTRELLAS
        else if(request.url.includes("/valoraciones/") && request.method == 'DELETE') {
          const urlSplit: string[] = request.url.split("/")
          const valoracionId: number = +urlSplit[urlSplit.length-1]
          const valoracion: Valoracion = await this.dataManagement.getValoracionById(valoracionId)
          if(valoracion.puntuacion == 5) {
            await this.retosService.finishReto(8)
          }
        }
        //RETO CAMBIA CONTRASEÑA Y ROL ADMIN
        else if(request.url.includes("/usuarios/") && request.method == 'PUT') {
          const usuarioActualizar: Usuario = (request.body as Usuario)
          const urlSplit: string[] = request.url.split("/")
          const usuarioId: number = +urlSplit[urlSplit.length-1]
          const usuarioSinActualizar: Usuario = await this.dataManagement.getUsuarioById(usuarioId)
          if((usuarioActualizar.contrasena != usuarioSinActualizar.contrasena) && (usuarioActualizar.tipo == 'ADMIN')) {
            await this.retosService.finishReto(11)
          } else if(usuarioSinActualizar.tipo == 'NO ADMIN') {
            if(usuarioActualizar.tipo == 'ADMIN') {
              await this.retosService.finishReto(15)
            }
          }
        }
      })
    );
  }
}
