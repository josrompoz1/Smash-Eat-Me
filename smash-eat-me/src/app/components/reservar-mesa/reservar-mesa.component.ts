import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CuponDescuento, Menu, Mesa } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-reservar-mesa',
  templateUrl: './reservar-mesa.component.html',
  styleUrls: ['./reservar-mesa.component.css', '../styles.css']
})
export class ReservarMesaComponent implements OnInit {

  menus: Menu[] = []
  form!: FormGroup;
  formDescuento!: FormGroup;
  menuSeleccionadoIndex: number = 0;
  mapMenuPrecio = new Map<Menu, number>();

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.menus = await this.dataManagement.getMenus();
    this.menus.forEach(menu => {
      this.mapMenuPrecio.set(menu, menu.precio)
    })
    this.form = new FormGroup({
      'nombre_apellido': new FormControl('', [Validators.required]),
      'correo': new FormControl('', [Validators.required]),
      'telefono': new FormControl('', [Validators.required]),
      'fecha': new FormControl('', [Validators.required]),
      'hora': new FormControl('', [Validators.required]),
      'nPersonas': new FormControl('', [Validators.required, Validators.min(1), Validators.max(20)])
    })
    this.formDescuento = new FormGroup({
      'codigo': new FormControl('', [Validators.required])
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
          usuarioId: 1,
          menuId: menu.id
        }
        console.log(mesa)
        await this.dataManagement.postReservaMesa(mesa);
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
            const precioConDescuento: number = menu.precio * (100 - descuento[0].porcentaje) / 100;
            this.mapMenuPrecio.set(menu, precioConDescuento)
          }
        })
        this.formDescuento.controls['codigo'].disable();
      }
    }
  }

}