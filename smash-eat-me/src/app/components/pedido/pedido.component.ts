import { Component, OnDestroy, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { CuponDescuento, DeleteCashRequest, Direccion, PedidoComida, ProductoOfertado, ProductoPedido, Tarjeta } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { Time } from "@angular/common";
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css', '../styles.css']
})
export class PedidoComponent implements OnInit, OnDestroy {

  direccion!: Direccion;
  tarjeta: Tarjeta | undefined;
  creditoDigital: boolean = false;
  productosPedido: ProductoOfertado[] = [];
  precioTotal: number = 0;
  descuento: CuponDescuento | undefined;
  productosCantidad = new Map<ProductoOfertado, number>();
  precioConDescuento: number = 0;
  precioFinal: number = 0;
  horaEntrega: string = "";
  b: boolean = true;
  productosPrecio = new Map<string, number>();
  userId: number = 0

  constructor(private dataManagement: DataManagementService, private sesionService: SesionService) {
    this.dataManagement.direccionSeleccionada?.subscribe(value => {
      this.direccion = value;
    })
    this.dataManagement.tarjetaSeleccionada.subscribe(value => {
      this.tarjeta = value;
    })
    this.dataManagement.seleccionadoCreditoDigital.subscribe(value => {
      this.creditoDigital = value;
    })
    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosPedido = value;
    })
    this.dataManagement.precioPedido.subscribe(value => {
      this.precioTotal = value;
    })
    this.dataManagement.descuentoAplicado.subscribe(value => {
      this.descuento = value;
    })
    this.dataManagement.horaSeleccionada.subscribe(value => {
      this.horaEntrega = value;
    })
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    this.getData()
  }

  ngOnDestroy() {
    this.destroyAll();
  }

  private getData() {
    this.precioFinal = this.precioTotal + 2;
    let array = from(this.productosPedido);
    array.forEach(val => {
      if (this.productosCantidad.has(val)) {
        let cantidad = this.productosCantidad.get(val)
        if (cantidad != undefined) {
          cantidad = cantidad + 2;
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
    
    if(this.descuento != undefined) {
      if(this.descuento.porcentaje != undefined) {
        this.precioConDescuento = (this.precioTotal * this.descuento.porcentaje) / 100
        this.precioFinal = this.precioTotal - this.precioConDescuento + 2;
      }
    } else {
      this.precioFinal = +this.precioTotal + 2;
      console.log(this.precioFinal)
    }
  }

  public async crearPedido() {
    if(this.userId > 0) {
      let metodo: string = "";
      if(this.creditoDigital == true) metodo = "Cartera digital"
      else metodo = "Tarjeta";
  
      const pedido: PedidoComida = {
        metodoPago: metodo,
        fecha: new Date(),
        hora: this.horaEntrega,
        nombreDireccion: this.direccion.direccion,
        usuarioId: this.userId,
        direccionUsuarioId: this.direccion.id
      };
      const credito: DeleteCashRequest = {
        creditoDigital: this.precioFinal
      }
  
      console.log(pedido)
      const pedidoResponse = await this.dataManagement.crearPedidoComida(pedido)
      if(this.creditoDigital == true) await this.dataManagement.deleteCreditoDigital(this.userId, credito);
      this.productosCantidad.forEach(async (cantidadProducto: number, producto: ProductoOfertado) => {
        if(producto.id) {
          const productoPedido: ProductoPedido = {
            cantidad: cantidadProducto,
            pedidoId: pedidoResponse.id,
            productoOfertadoId: producto.id
          }
          await this.dataManagement.postProductoPedido(productoPedido);
        }
        
      })
      this.b = false;
      this.dataManagement.numberOfItemsInBasket.next(0);
    }
    
    this.destroyAll()
  }

  private destroyAll() {
    this.b = false;
    this.dataManagement.numberOfItemsInBasket.next(0);
    this.dataManagement.productosEnCesta.next([]);
    this.dataManagement.direccionSeleccionada.next({})
    this.dataManagement.horaSeleccionada.next("");
    this.dataManagement.tarjetaSeleccionada.next({})
    this.dataManagement.seleccionadoCreditoDigital.next(false);
    this.dataManagement.precioPedido.next(0)
    this.dataManagement.descuentoAplicado.next({})

    localStorage.removeItem('numberOfItemsInBasket')
    localStorage.removeItem('productosEnCesta')
    localStorage.removeItem('direccionSeleccionada')
    localStorage.removeItem('horaSeleccionada')
    localStorage.removeItem('precioPedido')
    localStorage.removeItem('seleccionadoCreditoDigital')
    localStorage.removeItem('tarjetaSeleccionada')
    localStorage.removeItem('descuentoAplicado')
  }

}
