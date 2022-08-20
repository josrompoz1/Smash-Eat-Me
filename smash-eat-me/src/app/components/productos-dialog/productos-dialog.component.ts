import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  url?: SafeUrl

  constructor(public dataManagement: DataManagementService,
              private dialogRef: MatDialogRef<ProductosDialogComponent>,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    if(this.dataManagement.selectedProducto) {
      if(this.dataManagement.selectedProducto.id) {
        this.producto = await this.dataManagement.getProductosById(this.dataManagement.selectedProducto.id);
        this.url = this.sanitizer.bypassSecurityTrustUrl(this.producto.imagen)
        if(this.producto.id) this.valoraciones = await this.dataManagement.getValoracionesWithProductoId(this.producto.id)
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}
