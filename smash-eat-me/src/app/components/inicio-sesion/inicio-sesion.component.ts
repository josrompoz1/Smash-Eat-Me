import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login, LoginResponse } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {

  form!: FormGroup;
  loginResponse!: LoginResponse;

  constructor(private dataManagement: DataManagementService, private sesionService: SesionService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'contrasena': new FormControl('', [Validators.required])
    })
  }

  public async login() {
    if(this.form.valid) {
      const login: Login = {
        username: this.form.value.username,
        contrasena: this.form.value.contrasena
      }
      this.loginResponse = await this.dataManagement.login(login)
      if(this.loginResponse) {
        this.sesionService.iniciarSesion(this.loginResponse)
      }
    }
  }

}
