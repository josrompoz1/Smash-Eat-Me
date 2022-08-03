import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.css', '../styles.css']
})
export class EditProductoComponent implements OnInit {

  titulo: string = ''
  form!: FormGroup;
  errors: string[] = []

  constructor(public dataManagement: DataManagementService,
              private dialogRef: MatDialogRef<EditProductoComponent>) { }

  ngOnInit(): void {
    this.getData()
  }

  private getData() {
    if(this.dataManagement.selectedProducto) {
      this.titulo = 'Editar producto ' + this.dataManagement.selectedProducto.nombre
      this.form = new FormGroup({
        'nombre': new FormControl(this.dataManagement.selectedProducto.nombre, [Validators.required]),
        'tipo': new FormControl(this.dataManagement.selectedProducto.tipo, [Validators.required]),
        'precio': new FormControl(this.dataManagement.selectedProducto.precio, [Validators.required, Validators.min(1), Validators.max(100)]),
        'descripcion': new FormControl(this.dataManagement.selectedProducto.descripcion, [Validators.required]),
        'imagen': new FormControl(this.dataManagement.selectedProducto.imagen, [Validators.required])
      })
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  public async editarProducto() {
    if(this.form.valid) {
      this.errors.length = 0
      if(this.dataManagement.selectedProducto) {
        if(this.dataManagement.selectedProducto.id) {
          const producto: ProductoOfertado = {
            'nombre': this.form.value.nombre,
            'tipo': this.form.value.tipo,
            'descripcion': this.form.value.descripcion,
            'precio': this.form.value.precio,
            'imagen': this.form.value.imagen
          }
          await this.dataManagement.editarProducto(this.dataManagement.selectedProducto.id, producto).then(() => this.onClose())
        }
      }
    } else {
      this.errors.length = 0
        for(let x in this.form.controls) {
          if(this.form.controls[x].getError('required') != undefined) {
            this.errors.push('El campo ' + x + ' es necesario')
          } else if(this.form.controls[x].getError('min') != undefined) {
            this.errors.push('El precio no puede ser inferior a 1')
          } else if(this.form.controls[x].getError('max') != undefined) {
            this.errors.push('El precio no puede ser superior a 100')
          }
        }
    }
  }

}
