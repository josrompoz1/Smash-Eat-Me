import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductoOfertado, ValoracionResponse } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-productos-dialog',
  templateUrl: './productos-dialog.component.html',
  styleUrls: ['./productos-dialog.component.css', '../styles.css']
})
export class ProductosDialogComponent implements OnInit {

  producto!: ProductoOfertado;
  valoraciones: ValoracionResponse[] = [];

  constructor(public dataManagement: DataManagementService,
              private dialogRef: MatDialogRef<ProductosDialogComponent>) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    if(this.dataManagement.selectedProducto) {
      this.producto = this.dataManagement.selectedProducto;
      if(this.producto.id) this.valoraciones = await this.dataManagement.getValoracionesWithProductoId(this.producto.id)
    }
    console.log(this.valoraciones)
  }

  onClose() {
    this.dialogRef.close();
  }

}
