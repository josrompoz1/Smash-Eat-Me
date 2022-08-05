import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styleUrls: ['./add-producto.component.css', '../styles.css']
})
export class AddProductoComponent implements OnInit {

  form!: FormGroup;
  errors: string[] = [];

  constructor(private dataManagement: DataManagementService, private router: Router) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.form = new FormGroup({
      'nombre': new FormControl('', [Validators.required]),
      'descripcion': new FormControl('', [Validators.required]),
      'imagen': new FormControl('', [Validators.required]),
      'tipo': new FormControl('', [Validators.required]),
      'precio': new FormControl('', [Validators.required, Validators.max(100)])
    })
  }

  public async crearPlato() {
    if(this.form.valid) {
      this.errors.length = 0
      const producto: ProductoOfertado = {
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion,
        imagen: this.form.value.imagen,
        tipo: this.form.value.tipo,
        precio: this.form.value.precio,
      }
      await this.dataManagement.postProducto(producto).then(() => this.router.navigate(['']))
    } else {
      this.errors.length = 0
        for(let x in this.form.controls) {
          if(this.form.controls[x].getError('required') != undefined) {
            this.errors.push('El campo ' + x + ' es necesario')
          }
        }
    }
  }

}
