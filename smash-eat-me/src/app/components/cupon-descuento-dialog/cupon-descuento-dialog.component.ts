import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CuponDescuento } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-cupon-descuento-dialog',
  templateUrl: './cupon-descuento-dialog.component.html',
  styleUrls: ['./cupon-descuento-dialog.component.css', '../styles.css']
})
export class CuponDescuentoDialogComponent implements OnInit {

  titulo: string = '';
  form!: FormGroup;
  isReadOnly: boolean = false;
  errors: string[] = []

  constructor(private dataManagement: DataManagementService,
    private dialogRef: MatDialogRef<CuponDescuentoDialogComponent>) { }

  ngOnInit(): void {
    this.getData()
  }

  private getData() {
    this.errors.length = 0;
    if (this.dataManagement.selectedCupon) {
      this.titulo = 'Detalles del cupon ' + this.dataManagement.selectedCupon.codigo?.toUpperCase();
      this.isReadOnly = true;
      this.form = new FormGroup({
        'codigo': new FormControl(this.dataManagement.selectedCupon.codigo, [Validators.required]),
        'porcentaje': new FormControl(this.dataManagement.selectedCupon.porcentaje, [Validators.required, Validators.min(5), Validators.max(90)])
      })
    } else {
      this.titulo = 'Añadir un nuevo cupon de descuento'
      this.form = new FormGroup({
        'codigo': new FormControl('', [Validators.required]),
        'porcentaje': new FormControl('', [Validators.required, Validators.min(5), Validators.max(100)])
      })
    }
  }

  onClose() {
    this.dialogRef.close()
  }

  public async addOrUpdateCupon() {
    if (this.form.valid) {
      this.errors.length = 0;
      if (this.dataManagement.selectedCupon) {
        if(this.dataManagement.selectedCupon.id) {
          await this.dataManagement.changePercentCupon(this.dataManagement.selectedCupon.id, this.form.value.porcentaje)
        }
      } else {
        const cupon: CuponDescuento = {
          codigo: this.form.value.codigo,
          porcentaje: this.form.value.porcentaje
        }
        await this.dataManagement.postCuponDescuento(cupon)
      }
    } else {
      this.errors.length = 0
      for(let x in this.form.controls) {
        if(this.form.controls[x].getError('required') != undefined) {
          this.errors.push('El campo ' + x + ' es necesario')
        } else if(this.form.controls[x].getError('min') != undefined) {
          this.errors.push('El porcentaje no puede ser menor a 5')
        } else if(this.form.controls[x].getError('max') != undefined) {
          this.errors.push('El porcentaje no puede ser mayor a 100')
        }
      }
    }
  }

}
