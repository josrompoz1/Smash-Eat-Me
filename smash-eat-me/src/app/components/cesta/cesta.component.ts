import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
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
  enableDireccion: boolean = false

  constructor(private dataManagement: DataManagementService,
              private router: Router) {
    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosEnCesta = value;
    })
  }

  ngOnInit(): void {
    if(this.productosEnCesta.length > 0) {
      this.getData()
    }
  }

  private getData() {
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
    localStorage.setItem('precioPedido', JSON.stringify(this.precioTotal))
  }

  vaciarCesta() {
    this.productosEnCesta.length = 0;
    this.productosCantidad.clear()
    this.productosPrecio.clear();
    this.dataManagement.numberOfItemsInBasket.next(0);
    this.dataManagement.productosEnCesta.next(this.productosEnCesta);
    this.precioTotal = 0;
    this.dataManagement.precioPedido.next(this.precioTotal)
    this.dataManagement.direccionSeleccionada.next({})
    this.dataManagement.horaSeleccionada.next('')
    this.dataManagement.tarjetaSeleccionada.next({})
    this.dataManagement.seleccionadoCreditoDigital.next(false)
    this.dataManagement.descuentoAplicado.next({})
    localStorage.removeItem('numberOfItemsInBasket')
    localStorage.removeItem('productosEnCesta')
    localStorage.removeItem('direccionSeleccionada')
    localStorage.removeItem('horaSeleccionada')
    localStorage.removeItem('precioPedido')
    localStorage.removeItem('seleccionadoCreditoDigital')
    localStorage.removeItem('tarjetaSeleccionada')
    localStorage.removeItem('descuentoAplicado')
    this.enableDireccion = false
    this.router.navigate(['cesta'])
  }

  activarDireccion() {
    this.enableDireccion = true
  }

  eliminarUnProducto(producto: ProductoOfertado) {
    let indice = this.productosEnCesta.indexOf(producto);
    let productos: ProductoOfertado[] = this.productosEnCesta.splice(indice,1)
    localStorage.setItem('productosEnCesta', JSON.stringify(productos))
    localStorage.setItem('numberOfItemsInBasket', JSON.stringify(productos.length))
    this.dataManagement.numberOfItemsInBasket.next(productos.length)

    let cantidadActual = this.productosCantidad.get(producto)
    if (cantidadActual != undefined) {
      let cantidadRestante = cantidadActual - 1;
      if (cantidadRestante == 0) {
        this.productosCantidad.delete(producto)
      } else {
        this.productosCantidad.set(producto, cantidadRestante)
        this.productosPrecio.set(producto.nombre, producto.precio * cantidadRestante)
      }
      this.calculaPrecio()
    }
  }

  anyadirUnProducto(producto: ProductoOfertado) {
    const productos: ProductoOfertado[] = this.productosEnCesta
    productos.push(producto)
    localStorage.setItem('productosEnCesta', JSON.stringify(productos))
    localStorage.setItem('numberOfItemsInBasket', JSON.stringify(productos.length))
    this.dataManagement.numberOfItemsInBasket.next(productos.length)

    let cantidadActual = this.productosCantidad.get(producto)
    if (cantidadActual != undefined) {
      let cantidadSumante = cantidadActual + 1;
      this.productosCantidad.set(producto, cantidadSumante)
      this.productosPrecio.set(producto.nombre, producto.precio * cantidadSumante)

      this.calculaPrecio()
    }
  }

  private calculaPrecio() {
    this.precioTotal = 0;
    for (let key of this.productosCantidad.keys()) {
      let cantidad = this.productosCantidad.get(key);
      if (cantidad != undefined) {
        this.precioTotal += key.precio * cantidad;
      }
    }
    this.dataManagement.precioPedido.next(this.precioTotal)
  }

}
