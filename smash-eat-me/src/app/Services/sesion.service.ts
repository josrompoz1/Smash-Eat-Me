import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginResponse } from '../Models/types';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(private router: Router, private toastr: ToastrService) { }

  public iniciarSesion(login: LoginResponse) {
    localStorage.setItem('userLogged', 'true')
    localStorage.setItem('usuarioId', login.id.toString())
    localStorage.setItem('rol', login.tipo)
    localStorage.setItem('token', login.token)
    localStorage.setItem('fechaLogin', login.fechaLogin.toString())
    this.router.navigate([''])
  }

  public cerrarSesion() {
    localStorage.removeItem('userLogged')
    localStorage.removeItem('fechaLogin')
    localStorage.removeItem('usuarioId')
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    this.toastr.success('Sesión cerrada correctamente', 'Smash&Eat Me')
  }

  public redirectToLogin() {
    this.router.navigate(['signin'])
  }

}
