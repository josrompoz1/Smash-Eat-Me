import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductoOfertado, Valoracion } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-valoracion-dialog',
  templateUrl: './valoracion-dialog.component.html',
  styleUrls: ['./valoracion-dialog.component.css', '../styles.css']
})
export class ValoracionDialogComponent implements OnInit {

  productoAValorar!: ProductoOfertado;
  puntuacion: number = 0;
  value: number = 1;
  form!: FormGroup;

  constructor(public dataManagement: DataManagementService,
              private dialogRef: MatDialogRef<ValoracionDialogComponent>) { }

  ngOnInit(): void {
    if(this.dataManagement.selectedProducto) this.productoAValorar = this.dataManagement.selectedProducto;
    this.form = new FormGroup({
      'reseña': new FormControl('', [Validators.required])
    })
  }

  onClose() {
    this.dialogRef.close()
  }

  public setPuntuacion(puntuacion: number) {
    this.puntuacion = puntuacion;
  }

  public async crearValoracion() {
    console.log(this.form.value['reseña'])
    if(this.form.valid) {
      const valoracion: Valoracion = {
        puntuacion: this.puntuacion,
        reseña: this.form.value['reseña'],
        usuarioId: 1,
        productoPedidoId: this.productoAValorar.id
      }
      await this.dataManagement.postValoracion(valoracion);
    }
  }

}
