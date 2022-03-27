import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto';
import { Tipo } from '../tipo';
import { PRODUCTOS } from '../mock-productos';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos = PRODUCTOS;
  selectedProducto?: Producto;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(producto: Producto): void {
    this.selectedProducto = producto;
  }

}
