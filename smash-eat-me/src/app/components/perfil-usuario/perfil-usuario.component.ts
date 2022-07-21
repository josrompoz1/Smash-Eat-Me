import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Direccion, Tarjeta, Usuario, Valoracion } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { formatDate } from '@angular/common';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css', '../styles.css']
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {

  formUsuario!: FormGroup;
  formTarjeta!: FormGroup;
  formDireccion!: FormGroup;
  expandPanelTarjetas: boolean[] = []
  expandPanelDireccion: boolean[] = []
  usuario!: Usuario;
  tarjetas: Tarjeta[] = []
  direcciones: Direccion[] = []
  valoraciones: Valoracion[] = []
  idSelecc: number = 0;
  displayColumns: string[] = ['producto', 'puntuacion', 'resenya']
  rol: string = ''
  userId: number = 0

  constructor(private dataManagement: DataManagementService, private sesionService: SesionService) {
    this.sesionService.rol.subscribe(value => {
      this.rol = value
    })
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

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
      'nombre': new FormControl('', [Validators.required]),
      'direccion': new FormControl('', [Validators.required]),
      'ciudad': new FormControl('', [Validators.required]),
      'pais': new FormControl('', [Validators.required])
    })
    if(this.rol == 'ADMIN') {
      if(this.dataManagement.selectedUsuarioId) {
        this.idSelecc = this.dataManagement.selectedUsuarioId
        console.log(this.idSelecc)
      } else {
        this.idSelecc = this.userId
        console.log(this.idSelecc)
      }
    } else if(this.rol == 'NO ADMIN') {
      this.idSelecc = this.userId
    }
    this.getData()
  }

  ngOnDestroy(): void {
    this.dataManagement.selectedUsuarioId = undefined
  }

  private async getData() {
    this.usuario = await this.dataManagement.getUsuarioById(this.idSelecc)
    this.formUsuario.setValue({
      'username': this.usuario.username,
      'nombre': this.usuario.nombre,
      'correo': this.usuario.correo,
      'contrasena': this.usuario.contrasena,
      'tipo': this.usuario.tipo,
      'credito': this.usuario.creditoDigital,
      'telefono': this.usuario.telefono
    })
    this.tarjetas = await this.dataManagement.getTarjetasUsuario(this.idSelecc)
    this.tarjetas.forEach(tarjeta => {
      this.expandPanelTarjetas.push(false)
    })
    this.direcciones = await this.dataManagement.getDireccionesUsuario(this.idSelecc)
    this.direcciones.forEach(direccion => {
      this.expandPanelDireccion.push(false)
    })
    this.valoraciones = await this.dataManagement.getValoracionesByUsuarioId(this.idSelecc)
  }

  private async refreshData() {
    this.expandPanelDireccion.length = 0
    this.expandPanelTarjetas.length = 0
    await this.getData()
  }

  public async actualizarUsuario() {
    if (this.formUsuario.valid) {
      const usuario: Usuario = {
        username: this.formUsuario.value.username,
        nombre: this.formUsuario.value.nombre,
        correo: this.formUsuario.value.correo,
        contrasena: this.formUsuario.value.contrasena,
        telefono: this.formUsuario.value.telefono
      }
      await this.dataManagement.updateUsuario(usuario, this.idSelecc).then(() => {
        this.getData()
      })
    }
  }

  public fillForm(indice: number) {
    const tarjeta = this.tarjetas[indice]
    let i: number = 0;
    this.expandPanelTarjetas.forEach(() => {
      if (i == indice) {
        this.expandPanelTarjetas[i] = true
      } else {
        this.expandPanelTarjetas[i] = false
      }
      i++;
    })
    if (tarjeta.expiracion) {
      this.formTarjeta.setValue({
        'numeroTarjeta': tarjeta.numero,
        'expiracion': formatDate(tarjeta.expiracion, 'dd/MM/yyyy', 'en')
      })
    }
  }

  public fillFormDireccion(indice: number) {
    const direccion = this.direcciones[indice]
    let i: number = 0;
    this.expandPanelDireccion.forEach(() => {
      if (i == indice) {
        this.expandPanelDireccion[i] = true
      } else {
        this.expandPanelDireccion[i] = false
      }
      i++;
    })
    this.formDireccion.setValue({
      'nombre': direccion.nombreDireccion,
      'direccion': direccion.direccion,
      'ciudad': direccion.ciudad,
      'pais': direccion.pais
    })
  }

  public async editarTarjeta(indice: number) {
    let tarjetaSelecc = this.tarjetas[indice]
    if (this.formTarjeta.valid) {
      const id = tarjetaSelecc.id
      let fechaForm = this.formTarjeta.value.expiracion
      let fechaSplit: string[] = fechaForm.split("/")
      const fecha = fechaSplit[2] + "-" + fechaSplit[1] + "-" + fechaSplit[0]
      const tarjeta: Tarjeta = {
        numero: this.formTarjeta.value.numeroTarjeta,
        expiracion: fecha
      }
      if (id)
        await this.dataManagement.editarTarjeta(tarjeta, id).then(() => {
          this.getData()
        })
    }
  }

  public async editarDireccion(indice: number) {
    let direccionSelecc = this.direcciones[indice]
    if(this.formDireccion.valid) {
      const id = direccionSelecc.id
      const direccion: Direccion = {
        nombreDireccion: this.formDireccion.value.nombre,
        direccion: this.formDireccion.value.direccion,
        ciudad: this.formDireccion.value.ciudad,
        pais: this.formDireccion.value.pais
      }
      if(id) await this.dataManagement.editarDireccion(direccion, id).then(() => {
        this.getData()
      })
    }
  }

  public async eliminarTarjeta(indice: number) {
    let tarjetaSelecc = this.tarjetas[indice]
    const id = tarjetaSelecc.id
    if(id) {
      await this.dataManagement.deleteTarjeta(id).then(async () => {
        await this.refreshData()
      })
    }
  }

  public async eliminarDireccion(indice: number) {
    let direccionSelecc = this.direcciones[indice]
    const id = direccionSelecc.id
    if(id) {
      await this.dataManagement.deleteDireccion(id).then(async () => {
        await this.refreshData()
      })
    }
  }

}
