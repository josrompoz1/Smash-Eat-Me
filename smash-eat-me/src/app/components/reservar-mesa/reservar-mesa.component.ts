import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CuponDescuento, Menu, Mesa, Usuario } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-reservar-mesa',
  templateUrl: './reservar-mesa.component.html',
  styleUrls: ['./reservar-mesa.component.css', '../styles.css']
})
export class ReservarMesaComponent implements OnInit {

  menus: Menu[] = []
  form!: FormGroup;
  errorsMesa: string[] = []
  errors: string[] = []
  formDescuento!: FormGroup;
  menuSeleccionadoIndex: number = 0;
  mapMenuPrecio = new Map<Menu, number>();
  usuarioLogged!: Usuario;

  userId: number = 0;

  constructor(private dataManagement: DataManagementService, private sesionService: SesionService) {
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'nombre_apellido': new FormControl('', [Validators.required]),
      'correo': new FormControl('', [Validators.required]),
      'telefono': new FormControl('', [Validators.required]),
      'fecha': new FormControl('', [Validators.required]),
      'hora': new FormControl('', [Validators.required]),
      'nPersonas': new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)])
    })
    this.formDescuento = new FormGroup({
      'codigo': new FormControl('', [Validators.required])
    })
    this.getData()
  }

  private async getData() {
    this.usuarioLogged = await this.dataManagement.getUsuarioById(this.userId)
    console.log(this.usuarioLogged)
    this.menus = await this.dataManagement.getMenus();
    this.menus.forEach(menu => {
      if(menu.precio) this.mapMenuPrecio.set(menu, menu.precio)
    })
    this.form.setValue({
      'nombre_apellido': this.usuarioLogged.nombre,
      'correo': this.usuarioLogged.correo,
      'telefono': this.usuarioLogged.telefono,
      'fecha': '',
      'hora': '',
      'nPersonas': ''
    })
  }

  public async reservarMesa() {
    if(this.form.valid) {
      const menu = this.menus[this.menuSeleccionadoIndex]
      const precioConDescuento = this.mapMenuPrecio.get(menu);
      if(menu.id != undefined) {
        const mesa: Mesa = {
          numeroPersonas: this.form.value.nPersonas,
          fecha: new Date(this.form.value.fecha),
          hora: this.form.value.hora,
          precioDescuento: precioConDescuento,
          usuarioId: this.userId,
          menuId: menu.id
        }
        await this.dataManagement.postReservaMesa(mesa);
      }
    } else {
      this.errorsMesa.length = 0
      for(let x in this.form.controls) {
        if(this.form.controls[x].getError('required') != undefined) {
          this.errorsMesa.push('El campo ' + x + ' es necesario')
        }
      }
    }
  }

  public setMenuSeleccionado(i: number) {
    this.menuSeleccionadoIndex = i;
  }

  public async aplicarDescuento() {
    if (this.formDescuento.valid) {
      const descuento: CuponDescuento[] = await this.dataManagement.getCuponDescuentoByCodigo(this.formDescuento.value.codigo)
      if(descuento.length > 0) {
        this.menus.forEach(menu => {
          if (descuento[0].porcentaje != undefined) {
            if(menu.precio) {
              const precioConDescuento: number = menu.precio * (100 - descuento[0].porcentaje) / 100;
              this.mapMenuPrecio.set(menu, precioConDescuento)
            }
          }
        })
        this.formDescuento.controls['codigo'].disable();
      }
    } else {
      this.errors.length = 0
      for(let x in this.formDescuento.controls) {
        if(this.formDescuento.controls[x].getError('required') != undefined) {
          this.errors.push('El campo ' + x + ' es necesario')
        }
      }
    }
  }

}