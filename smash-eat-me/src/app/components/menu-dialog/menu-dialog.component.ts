import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Menu, ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.css', '../styles.css']
})
export class MenuDialogComponent implements OnInit {

  titulo: string = '';
  form!: FormGroup;
  isReadOnly: boolean = false;
  productosDisponibles: ProductoOfertado[] = []
  productosEnMenu: ProductoOfertado[] = []

  constructor(public dataManagement: DataManagementService,
    private dialogRef: MatDialogRef<MenuDialogComponent>) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    if (this.dataManagement.selectedMenu) {
      this.isReadOnly = true;
      this.titulo = 'Actualizar el menu ' + this.dataManagement.selectedMenu.nombre.toUpperCase();
      this.form = new FormGroup({
        'nombre': new FormControl(this.dataManagement.selectedMenu.nombre, [Validators.required]),
        'descripcion': new FormControl(this.dataManagement.selectedMenu.descripcion, [Validators.required]),
        'precio': new FormControl(this.dataManagement.selectedMenu.precio, [Validators.required]),
        'producto': new FormControl('', [Validators.required])
      })
      this.productosDisponibles = await this.dataManagement.getProductosSinMenuId()
      if(this.dataManagement.selectedMenu.id) this.productosEnMenu = await this.dataManagement.getProductosByMenuId(this.dataManagement.selectedMenu.id)

    } else {
      this.titulo = 'Añadir un nuevo menú'
      this.form = new FormGroup({
        'nombre': new FormControl('', [Validators.required]),
        'descripcion': new FormControl('', [Validators.required]),
        'precio': new FormControl('', [Validators.required])
      })
    }
  }

  onClose() {
    this.dialogRef.close()
  }

  public async addOrUpdateMenu() {
    if (this.form.valid) {
      if (this.dataManagement.selectedMenu) {
        if(this.dataManagement.selectedMenu.id)
          await this.dataManagement.putMenuIdInProducto(this.form.value.producto, this.dataManagement.selectedMenu.id).then(() => {
            this.getData()
          })
      } else {
        const menu: Menu = {
          nombre: this.form.value.nombre,
          descripcion: this.form.value.descripcion,
          precio: this.form.value.precio
        }
        await this.dataManagement.postMenu(menu)
      }
    }
  }

}
