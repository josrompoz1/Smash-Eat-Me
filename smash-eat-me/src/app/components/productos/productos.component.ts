import { Component, OnInit } from '@angular/core';
import { ProductoOfertado } from 'src/app/Models/types';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductosDialogComponent } from '../productos-dialog/productos-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css', '../styles.css']
})
export class ProductosComponent implements OnInit {
  public productos: ProductoOfertado[] = [];

  private productosAñadidos:  ProductoOfertado[] = [];

  //Paginator inputs
  page_size: number = 6;
  page_number: number = 1;
  pageSizeOptions: number[] = [6, 12, 24, 48];
  form!: FormGroup;

  constructor(private dataManagement: DataManagementService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getData()
  }

  private async getData() {
    this.productos = await this.dataManagement.getProductos();
    this.form = new FormGroup({
      'busqueda': new FormControl('')
    })
  }

  public async onSelect(producto: ProductoOfertado): Promise<void> {
    this.dataManagement.selectedProducto = producto;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    this.dialog.open(ProductosDialogComponent, dialogConfig);
  }

  handlePage(page: PageEvent) {
    this.page_size = page.pageSize;
    this.page_number = page.pageIndex + 1;
  }

  public onAdd(producto: ProductoOfertado) {
    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosAñadidos = value;
    })
    this.productosAñadidos.push(producto);
    this.dataManagement.productosEnCesta.next(this.productosAñadidos);
    this.dataManagement.numberOfItemsInBasket.next(this.productosAñadidos.length);
  }

  public async buscarPlato(): Promise<void> {
    const busqueda: string = this.form.controls['busqueda'].value;
    console.log(busqueda);
    if(busqueda!=='') {
      this.productos = await this.dataManagement.getProductosPorBusqueda(busqueda);
    } else {
      this.productos = await this.dataManagement.getProductos();
    }
  }

}
