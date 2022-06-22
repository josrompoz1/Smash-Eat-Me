import { Component, OnInit } from '@angular/core';
import { from, map } from 'rxjs';
import { ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-cesta',
  templateUrl: './cesta.component.html',
  styleUrls: ['./cesta.component.css', '../styles.css']
})
export class CestaComponent implements OnInit {

  productosEnCesta: ProductoOfertado[] = [];
  productosCantidad = new Map<ProductoOfertado, number>();
  productosPrecio = new Map<string, number>();
  precioTotal: number = 0;

  constructor(private dataManagement: DataManagementService) {
    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosEnCesta = value;
    })
  }

  ngOnInit(): void {
    let array = from(this.productosEnCesta);
    array.forEach(val => {
      if (this.productosCantidad.has(val)) {
        let cantidad = this.productosCantidad.get(val)
        if (cantidad != undefined) {
          cantidad = cantidad + 1;
          this.productosCantidad.set(val, cantidad)
        }
      } else {
        this.productosCantidad.set(val, 1);
      }
    })
    for (let key of this.productosCantidad.keys()) {
      let cantidad = this.productosCantidad.get(key);
      if (cantidad != undefined) {
        this.productosPrecio.set(key.nombre, key.precio * cantidad)
        this.precioTotal += key.precio * cantidad;
      }
    }
  }

  vaciarCesta() {
    this.productosEnCesta.length = 0;
    this.productosCantidad.clear()
    this.productosPrecio.clear();
    this.dataManagement.numberOfItemsInBasket.next(0);
    this.dataManagement.productosEnCesta.next(this.productosEnCesta);
    this.precioTotal = 0;
  }

  tramitarPedido() {
    console.log(this.productosEnCesta)
  }

  eliminarUnProducto(producto: ProductoOfertado) {
    let indice = this.productosEnCesta.indexOf(producto);
    const prueba = this.productosEnCesta
    this.productosEnCesta.splice(indice,1)
    this.dataManagement.productosEnCesta.next(this.productosEnCesta)
    this.dataManagement.numberOfItemsInBasket.next(this.productosEnCesta.length)

    let cantidadActual = this.productosCantidad.get(producto)
    if (cantidadActual != undefined) {
      let cantidadRestante = cantidadActual - 1;
      if (cantidadRestante == 0) {
        this.productosCantidad.delete(producto)
      } else {
        this.productosCantidad.set(producto, cantidadRestante)
        this.productosPrecio.set(producto.nombre, producto.precio * cantidadRestante)
      }
      this.precioTotal = 0;
      for (let key of this.productosCantidad.keys()) {
        let cantidad = this.productosCantidad.get(key);
        if (cantidad != undefined) {
          this.precioTotal += key.precio * cantidad;
        }
      }
    }
  }

  anyadirUnProducto(producto: ProductoOfertado) {    
    this.productosEnCesta.push(producto)
    this.dataManagement.productosEnCesta.next(this.productosEnCesta)
    this.dataManagement.numberOfItemsInBasket.next(this.productosEnCesta.length)

    let cantidadActual = this.productosCantidad.get(producto)
    if (cantidadActual != undefined) {
      let cantidadSumante = cantidadActual + 1;
      this.productosCantidad.set(producto, cantidadSumante)
      this.productosPrecio.set(producto.nombre, producto.precio * cantidadSumante)

      this.precioTotal = 0;
      for (let key of this.productosCantidad.keys()) {
        let cantidad = this.productosCantidad.get(key);
        if (cantidad != undefined) {
          this.precioTotal += key.precio * cantidad;
        }
      }
    }
  }

}
