import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.form = new FormGroup({
      'nombre': new FormControl('', [Validators.required]),
      'descripcion': new FormControl('', [Validators.required]),
      'imagen': new FormControl('', [Validators.required]),
      'tipo': new FormControl('', [Validators.required]),
      'precio': new FormControl('', [Validators.required])
    })
  }

  public async crearPlato() {
    if(this.form.valid) {
      const producto: ProductoOfertado = {
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion,
        imagen: this.form.value.imagen,
        tipo: this.form.value.tipo,
        precio: this.form.value.precio,
      }
      await this.dataManagement.postProducto(producto)
    }
  }

}