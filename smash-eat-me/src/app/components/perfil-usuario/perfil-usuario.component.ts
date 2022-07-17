import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Direccion, Tarjeta, Usuario } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css', '../styles.css']
})
export class PerfilUsuarioComponent implements OnInit {

  formUsuario!: FormGroup;
  formTarjeta!: FormGroup;
  formDireccion!: FormGroup;
  expandPanelTarjetas: boolean[] = []
  usuario!: Usuario;
  tarjetas: Tarjeta[] = []
  direcciones: Direccion[] = []
  id: number = 1;

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.formUsuario = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'nombre': new FormControl('', [Validators.required]),
      'correo': new FormControl('', [Validators.required, Validators.email]),
      'contrasena': new FormControl('', [Validators.required]),
      'tipo': new FormControl('', [Validators.required]),
      'credito': new FormControl('', [Validators.required]),
      'telefono': new FormControl('', [])
    })
    this.formTarjeta = new FormGroup({
      'numeroTarjeta': new FormControl('', [Validators.required]),
      'expiracion': new FormControl('', [Validators.required])
    })
    this.formDireccion = new FormGroup({
      
    })
    this.getData()
  }

  private async getData() {
    this.usuario = await this.dataManagement.getUsuarioById(this.id)
    this.formUsuario.setValue({
      'username': this.usuario.username,
      'nombre': this.usuario.nombre,
      'correo': this.usuario.correo,
      'contrasena': this.usuario.contrasena,
      'tipo': this.usuario.tipo,
      'credito': this.usuario.creditoDigital,
      'telefono': this.usuario.telefono
    })
    this.tarjetas = await this.dataManagement.getTarjetasUsuario(this.id)
    this.tarjetas.forEach(tarjeta => {
      this.expandPanelTarjetas.push(false)
    })
    this.direcciones = await this.dataManagement.getDireccionesUsuario(this.id)
  }

  public async actualizarUsuario() {
    if(this.formUsuario.valid) {
      const usuario: Usuario = {
        username: this.formUsuario.value.username,
        nombre: this.formUsuario.value.nombre,
        correo: this.formUsuario.value.correo,
        contrasena: this.formUsuario.value.contrasena,
        telefono: this.formUsuario.value.telefono
      }
      await this.dataManagement.updateUsuario(usuario, this.id).then(() => {
        this.getData()
      })
    }
  }

  public fillForm(indice: number) {
    const tarjeta = this.tarjetas[indice]
    let i: number = 0;
    this.expandPanelTarjetas.forEach(() => {
      if(i == indice) {
        this.expandPanelTarjetas[i] = true
      } else {
        this.expandPanelTarjetas[i] = false
      }
      i++;
    })
    if(tarjeta.expiracion) {
      this.formTarjeta.setValue({
        'numeroTarjeta': tarjeta.numero,
        // 'expiracion': formatDate(tarjeta.expiracion, 'dd/MM/yyyy', 'en')
        'expiracion': tarjeta.expiracion
      })
    }
  }

  public async editarTarjeta(indice: number) {
    let tarjetaSelecc = this.tarjetas[indice]
    console.log(tarjetaSelecc)
    if(this.formTarjeta.valid) {
      const id = tarjetaSelecc.id
      // const fecha = new Date(this.formTarjeta.value.expiracion)
      const tarjeta: Tarjeta = {
        numero: this.formTarjeta.value.numeroTarjeta,
        expiracion: this.formTarjeta.value.expiracion
      }
      console.log(tarjeta)
      if(id)
      await this.dataManagement.editarTarjeta(tarjeta, id).then(() => {
        this.getData()
      })
    }
  }

}
