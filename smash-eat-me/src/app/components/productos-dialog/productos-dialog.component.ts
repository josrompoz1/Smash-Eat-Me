import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from 'src/app/Services/producto.service';

@Component({
  selector: 'app-productos-dialog',
  templateUrl: './productos-dialog.component.html',
  styleUrls: ['./productos-dialog.component.css']
})
export class ProductosDialogComponent implements OnInit {

  constructor(public productoService: ProductoService, private dialogRef: MatDialogRef<ProductosDialogComponent>) { }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }

}
