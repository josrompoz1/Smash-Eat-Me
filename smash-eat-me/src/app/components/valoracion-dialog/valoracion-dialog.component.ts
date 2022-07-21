import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductoOfertado, Valoracion } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-valoracion-dialog',
  templateUrl: './valoracion-dialog.component.html',
  styleUrls: ['./valoracion-dialog.component.css', '../styles.css']
})
export class ValoracionDialogComponent implements OnInit {

  productoAValorar!: ProductoOfertado;
  form!: FormGroup;
  userId: number = 0;

  constructor(public dataManagement: DataManagementService,
              private dialogRef: MatDialogRef<ValoracionDialogComponent>,
              private sesionService: SesionService) {
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    if(this.dataManagement.selectedProducto) this.productoAValorar = this.dataManagement.selectedProducto;
    this.form = new FormGroup({
      'resenya': new FormControl('', [Validators.required]),
      'puntuacion': new FormControl('', [Validators.required])
    })
  }

  onClose() {
    this.dialogRef.close()
  }

  public async crearValoracion() {
    if(this.form.valid) {
      if(this.productoAValorar.id) {
        const valoracion: Valoracion = {
          puntuacion: this.form.value['puntuacion'],
          resenya: this.form.value['resenya'],
          nombreUsuario: 'perico',
          nombreProducto: this.productoAValorar.nombre,
          usuarioId: this.userId,
          productoPedidoId: this.productoAValorar.id
        }
        await this.dataManagement.postValoracion(valoracion);
      }
    }
  }

}
