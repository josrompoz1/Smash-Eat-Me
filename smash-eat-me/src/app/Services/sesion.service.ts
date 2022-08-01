import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
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

  constructor(private router: Router, private toastr: ToastrService, private retosService: RetosService) {
    let storedUserLogged = sessionStorage.getItem('userLogged')
    let storedRol = sessionStorage.getItem('rol')
    let storedUserId = sessionStorage.getItem('usuarioId')
    let fecha = sessionStorage.getItem('fechaLogin')
    if (storedUserLogged) this.setUserLogged(storedUserLogged)
    if (storedRol) this.setRol(storedRol)
    if (storedUserId) this.setUserId(storedUserId)
    if(fecha) this.fechaLogin.next(JSON.parse(fecha))
    this.rol.subscribe((data: string) => {
      const rolActual = this.rol.getValue()
      console.log(rolActual)
      console.log(data)
      // this.retosService.finishReto(15)
      // https://stackoverflow.com/questions/66275321/how-to-get-previous-value-subject
    })
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
    this.toastr.success('Sesión cerrada correctamente', 'Smash&Eat Me')
    this.router.navigate([''])
  }

  public redirectToLogin() {
    this.router.navigate(['signin'])
  }

}
