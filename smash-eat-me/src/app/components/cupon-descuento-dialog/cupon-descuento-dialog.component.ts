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

  constructor(private dataManagement: DataManagementService,
    private dialogRef: MatDialogRef<CuponDescuentoDialogComponent>) { }

  ngOnInit(): void {
    this.getData()
  }

  private getData() {
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
        'porcentaje': new FormControl('', [Validators.required, Validators.min(5), Validators.max(90)])
      })
    }
  }

  onClose() {
    this.dialogRef.close()
  }

  public async addOrUpdateCupon() {
    if (this.form.valid) {
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
    }
  }

}
