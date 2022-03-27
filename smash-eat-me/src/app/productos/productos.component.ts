import { Component, OnInit } from '@angular/core';
import { Producto } from '../Models/producto';
import { ProductoService } from '../Services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  selectedProducto?: Producto;

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(productos => this.productos = productos);
  }

  getProductos(): void {
    this.productoService.getProductos().subscribe((data : any[]) => {
      this.productos = data;
    })
  }

  onSelect(producto: Producto): void {
    this.selectedProducto = producto;
  }

}
