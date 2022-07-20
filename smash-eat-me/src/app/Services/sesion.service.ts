import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../Models/types';

@Injectable({
  providedIn: 'root'
})
export class SesionService implements CanActivate {

  public userLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public rol: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userId: BehaviorSubject<number> = new BehaviorSubject<number>(0)

  constructor(private router: Router, private toastr: ToastrService) {
    let storedUserLogged = localStorage.getItem('userLogged')
    let storedRol = localStorage.getItem('rol')
    let storedUserId = localStorage.getItem('usuarioId')
    if (storedUserLogged) this.setUserLogged(storedUserLogged)
    if (storedRol) this.setRol(storedRol)
    if (storedUserId) this.setUserId(storedUserId)
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
    localStorage.setItem('userLogged', 'true')
    localStorage.setItem('usuarioId', login.id.toString())
    localStorage.setItem('rol', login.tipo)
    localStorage.setItem('token', login.token)
    localStorage.setItem('fechaLogin', login.fechaLogin.toString())
    this.userLogged.next(true);
    this.rol.next(login.tipo)
    this.router.navigate([''])
  }

  public cerrarSesion() {
    localStorage.removeItem('userLogged')
    localStorage.removeItem('fechaLogin')
    localStorage.removeItem('usuarioId')
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    this.userLogged.next(false)
    this.rol.next('')
    this.toastr.success('Sesión cerrada correctamente', 'Smash&Eat Me')
  }

  public redirectToLogin() {
    this.router.navigate(['signin'])
  }

}
