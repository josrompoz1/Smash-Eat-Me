import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginResponse } from '../Models/types';
import { RetosService } from './retos.service';

@Injectable({
  providedIn: 'root'
})
export class SesionService implements CanActivate {

  public userLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public rol: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userId: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public fechaLogin: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public idsReto: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  constructor(private router: Router, private retosService: RetosService) {
    let storedUserLogged = sessionStorage.getItem('userLogged')
    let storedRol = sessionStorage.getItem('rol')
    let storedUserId = sessionStorage.getItem('usuarioId')
    let fecha = sessionStorage.getItem('fechaLogin')
    let rolesReto = localStorage.getItem('rolesReto')
    let idsReto = localStorage.getItem('idsReto')
    let fechaReto = localStorage.getItem('fechaReto')
    if (storedUserLogged) this.setUserLogged(storedUserLogged)
    if (storedRol) this.setRol(storedRol)
    if (storedUserId) this.setUserId(storedUserId)
    if(fecha) this.fechaLogin.next(JSON.parse(fecha))
    //RETO ROL ADMIN
    if(rolesReto) {
      let roles: string[] = JSON.parse(rolesReto)
      roles.push(this.rol.getValue())
      if(roles.length == 2) {
        if(roles[0] == 'NO ADMIN' && roles[1] == 'ADMIN') {
          this.retosService.finishReto(15)
        }
      }
    }
    //RETO VER PEDIDOS
    if(idsReto) {
      let ids: number[] = JSON.parse(idsReto)
      ids.push(this.userId.getValue())
      if(ids.length == 2) {
        if(ids[0] != ids[1]) {
          this.idsReto.next(ids)
        } else {
          this.idsReto.next([])
        }
      }
    }
    //RETO SESION INFINITA
    if(fechaReto) {
      let fechas: number[] = JSON.parse(fechaReto)
      fechas.push(this.fechaLogin.getValue())
      if(fechas.length == 2) {
        if((fechas[1] - fechas[0]) > 20000000) {
          this.retosService.finishReto(12)
        }
      }
    }
  }

  canActivate() {
    if(this.isAdmin(this.rol.getValue())) {
      return true;
    }
    return false;
  }

  setUserLogged(data: any) {
    this.userLogged.next(data);
  }

  setRol(data: any) {
    this.rol.next(data);
  }

  setUserId(data: any) {
    this.userId.next(data);
  }

  isAdmin(rol: string): boolean {
    return rol == 'ADMIN'
  }

  public iniciarSesion(login: LoginResponse) {
    sessionStorage.setItem('userLogged', 'true')
    sessionStorage.setItem('usuarioId', login.id.toString())
    sessionStorage.setItem('rol', login.tipo)
    sessionStorage.setItem('token', login.token)
    sessionStorage.setItem('fechaLogin', login.fechaLogin.toString())
    this.userLogged.next(true);
    this.rol.next(login.tipo)
    this.userId.next(login.id)
    let tipoUsuario: string[] = []
    tipoUsuario.push(login.tipo)
    localStorage.setItem('rolesReto', JSON.stringify(tipoUsuario))
    let idUsuario: number[] = []
    idUsuario.push(login.id)
    localStorage.setItem('idsReto', JSON.stringify(idUsuario))
    let fechaLogin: string[] = []
    fechaLogin.push(login.fechaLogin.toString())
    localStorage.setItem('fechaReto', JSON.stringify(fechaLogin))
    this.router.navigate([''])
  }

  public cerrarSesion() {
    sessionStorage.removeItem('userLogged')
    sessionStorage.removeItem('fechaLogin')
    sessionStorage.removeItem('usuarioId')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('rol')
    this.userLogged.next(false)
    this.rol.next('')
    this.userId.next(0)
    localStorage.removeItem('rolesReto')
    localStorage.removeItem('idsReto')
    this.idsReto.next([])
    localStorage.removeItem('fechaReto')
    localStorage.removeItem('productosEnCesta')
    localStorage.removeItem('precioPedido')
    localStorage.removeItem('numberOfItemsInBasket')
    window.location.reload()
    this.router.navigate([''])
  }

  public redirectToLogin() {
    this.router.navigate(['signin'])
  }

}
