import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginResponse } from '../Models/types';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  public userLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public rol: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userId: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public fechaLogin: BehaviorSubject<number> = new BehaviorSubject<number>(0)

  public idsReto: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public rolesReto: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private router: Router) {
    let storedUserLogged = sessionStorage.getItem('userLogged')
    let storedRol = sessionStorage.getItem('rol')
    let storedUserId = sessionStorage.getItem('usuarioId')
    let fecha = sessionStorage.getItem('fechaLogin')
    let rolesReto = localStorage.getItem('rolesReto')
    let idsReto = localStorage.getItem('idsReto')
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
          // this.finishService.finishReto(15)
          this.rolesReto.next(roles)
        } else {
          this.rolesReto.next([])
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
    this.rolesReto.next([])
    localStorage.removeItem('productosEnCesta')
    localStorage.removeItem('precioPedido')
    localStorage.removeItem('numberOfItemsInBasket')
    this.router.navigate([''])
  }

  public redirectToLogin() {
    this.router.navigate(['signin'])
  }

}
