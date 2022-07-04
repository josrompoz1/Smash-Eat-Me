import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CuponDescuento, DeleteCashRequest, Direccion, Menu, PedidoComida, PedidoComidaResponse, ProductoOfertado, ProductoPedido, Tarjeta, Valoracion } from '../Models/types';
import { RestService } from './rest-service.service';

@Injectable()
export class DataManagementService {

  selectedProducto?: ProductoOfertado;
  public numberOfItemsInBasket: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public productosEnCesta: BehaviorSubject<ProductoOfertado[]> = new BehaviorSubject<ProductoOfertado[]>([]);
  public direccionSeleccionada: BehaviorSubject<Direccion> = new BehaviorSubject<Direccion>({});
  public horaSeleccionada: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public tarjetaSeleccionada: BehaviorSubject<Tarjeta> = new BehaviorSubject<Tarjeta>({});
  public seleccionadoCreditoDigital: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public precioPedido: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public descuentoAplicado: BehaviorSubject<CuponDescuento> = new BehaviorSubject<CuponDescuento>({});

  constructor(private rest: RestService) { }

  //PRODUCTOS
  public async getProductos(): Promise<ProductoOfertado[]> {
    return await this.rest.getProductos();
  }

  public async getProductosPorBusqueda(busqueda: string): Promise<ProductoOfertado[]> {
    return await this.rest.getProductosPorBusqueda(busqueda);
  }

  public async getProductosById(id: number): Promise<ProductoOfertado> {
    return await this.rest.getProductosById(id);
  }

  //MENUS
  public async getMenus(): Promise<Menu[]> {
    return await this.rest.getMenus();
  }

  //USUARIOS
  public async crearUsuario(usuario: any) {
    return await this.rest.crearUsuario(usuario);
  }

  public async getDireccionesUsuario(id: number): Promise<Direccion[]> {
    return await this.rest.getDireccionesUsuario(id);
  }

  public async crearDireccion(direccion: any) {
    return await this.rest.crearDireccion(direccion);
  }

  public async getTarjetasUsuario(usuarioId: number): Promise<Tarjeta[]> {
    return await this.rest.getTarjetasUsuario(usuarioId);
  }

  public async crearTarjeta(tarjeta: any) {
    return await this.rest.crearTarjeta(tarjeta);
  }

  public async getCreditoDigital(usuarioId: number): Promise<number> {
    return await this.rest.getCreditoDigital(usuarioId);
  }

  public async addCreditoDigital(usuarioId: number, credito: number) {
    return await this.rest.addCreditoDigital(usuarioId, credito);
  }

  public async deleteCreditoDigital(usuarioId: number, credito: DeleteCashRequest) {
    return await this.rest.deleteCreditoDigital(usuarioId, credito);
  }

  //CUPONES DESCUENTO
  public async getCuponDescuentoByCodigo(codigo: string): Promise<CuponDescuento[]> {
    return await this.rest.getCuponDescuentoByCodigo(codigo);
  }

  //PEDIDOS COMIDA
  public async getPedidosByUsuarioId(usuarioId: number): Promise<PedidoComida[]> {
    return await this.rest.getPedidosByUsuarioId(usuarioId);
  }

  public async getPedidoComidaById(id: number): Promise<PedidoComida> {
    return await this.rest.getPedidoComidaById(id);
  }

  public async crearPedidoComida(pedido: PedidoComida): Promise<PedidoComidaResponse> {
    return await this.rest.crearPedidoComida(pedido)
  }

  //PRODUCTOS PEDIDOS
  public async getProductosEnPedidoById(pedidoId: number): Promise<ProductoPedido[]> {
    return await this.rest.getProductosEnPedidoById(pedidoId);
  }

  public async postProductoPedido(productoPedido: ProductoPedido) {
    return await this.rest.postProductoPedido(productoPedido)
  }

  //VALORACIONES
  public async postValoracion(valoracion: Valoracion) {
    return await this.rest.postValoracion(valoracion)
  }

}
