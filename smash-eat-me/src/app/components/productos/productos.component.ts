import { Component, OnInit } from '@angular/core';
import { ProductoOfertado } from 'src/app/Models/types';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductosDialogComponent } from '../productos-dialog/productos-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { EditProductoComponent } from '../edit-producto/edit-producto.component';
import { FiltroProductosComponent } from '../filtro-productos/filtro-productos.component';
import { SesionService } from 'src/app/Services/sesion.service';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css', '../styles.css']
})
export class ProductosComponent implements OnInit {
  public productos: ProductoOfertado[] = [];

  private productosAñadidos:  ProductoOfertado[] = [];
  form!: FormGroup;
  numberOfFilters: number = 0;
  hidden: boolean = true;
  paramTipo!: string;
  paramBusqueda!: string;
  searchValue?: SafeHtml

  rol: string = '';

  constructor(private dataManagement: DataManagementService, private dialog: MatDialog, private sesionService: SesionService, private sanitizer: DomSanitizer) {
    this.dataManagement.paramTipo.subscribe(value => {
      this.paramTipo = value
    })
    this.dataManagement.paramBusqueda.subscribe(value => {
      this.paramBusqueda = value
    })
    this.sesionService.rol.subscribe(value => {
      this.rol = value
    })
  }

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
    dialogConfig.width = "65%"
    dialogConfig.height = "90%"
    let dialogRef = this.dialog.open(ProductosDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.dataManagement.selectedProducto = undefined;
    })
  }

  public onAdd(producto: ProductoOfertado) {
    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosAñadidos = value;
    })
    this.productosAñadidos.push(producto);
    this.dataManagement.productosEnCesta.next(this.productosAñadidos);
    this.dataManagement.numberOfItemsInBasket.next(this.productosAñadidos.length);
    localStorage.setItem('productosEnCesta', JSON.stringify(this.productosAñadidos))
    localStorage.setItem('numberOfItemsInBasket', JSON.stringify(this.productosAñadidos.length))
  }

  public async onDelete(producto: ProductoOfertado) {
    if(producto.id)
    await this.dataManagement.deleteProducto(producto.id).then(() => {
      this.getData()
    })
  }

  public onEdit(producto: ProductoOfertado) {
    this.dataManagement.selectedProducto = producto;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = "70%"
    dialogConfig.height = "90%"
    let dialogRef = this.dialog.open(EditProductoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.dataManagement.selectedProducto = undefined;
      this.getData()
    })
  }

  public filterDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.height = "70%"
    let dialogRef = this.dialog.open(FiltroProductosComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.filterData()
    })
  }

  private async filterData() {
    if(this.paramTipo != '' && this.paramBusqueda != '') {
      this.searchValue = this.sanitizer.bypassSecurityTrustHtml(this.paramBusqueda)
      this.hidden = false;
      this.numberOfFilters = 2;
      this.productos = await this.dataManagement.getProductosFilterByTipoAndNombre(this.paramTipo, this.paramBusqueda)
    } else if(this.paramTipo != '') {
      this.hidden = false;
      this.numberOfFilters = 1;
      this.productos = await this.dataManagement.getProductosPorTipo(this.paramTipo);
    } else if(this.paramBusqueda != '') {
      this.searchValue = this.sanitizer.bypassSecurityTrustHtml(this.paramBusqueda)
      this.hidden = false;
      this.numberOfFilters = 1;
      this.productos = await this.dataManagement.getProductosPorBusqueda(this.paramBusqueda);
    } else {
      this.hidden = true;
      this.numberOfFilters = 0;
      this.searchValue = undefined
      this.getData()
    }
  }

}
