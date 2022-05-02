import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/Models/types';
import { ProductoService } from 'src/app/Services/producto.service'; 
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductosDialogComponent } from '../productos-dialog/productos-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  public productos: Producto[] = [];

  //Paginator inputs
  page_size: number = 6;
  page_number: number = 1;
  pageSizeOptions: number[] = [6, 12, 24, 48];
  form!: FormGroup;

  constructor(private productoService: ProductoService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getProductos();
    this.form = new FormGroup({
      'busqueda': new FormControl('')
    })
  }

  private async getProductos(): Promise<void> {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  public async onSelect(producto: Producto): Promise<void> {
    this.productoService.selectedProducto = producto;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    this.dialog.open(ProductosDialogComponent, dialogConfig);
  }

  handlePage(page: PageEvent) {
    this.page_size = page.pageSize;
    this.page_number = page.pageIndex + 1;
  }

  public onAdd() {
    this.dialog.closeAll();
    console.log("El icono funciona");
  }

  buscarPlato() {
    const busqueda: string = this.form.controls['busqueda'].value;
    console.log(busqueda);
    if(busqueda!=='') {
      this.productoService.getProductosPorBusqueda(busqueda).subscribe(data => {
        this.productos = data;
      });
    } else {
      this.productoService.getProductos().subscribe(data => {
        this.productos = data;
      });
    }
  }

}
