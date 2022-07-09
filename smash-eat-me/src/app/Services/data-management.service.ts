import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CuponDescuento, DeleteCashRequest, Direccion, Menu, Mesa, PedidoComida, PedidoComidaResponse, ProductoOfertado, ProductoPedido, Tarjeta, Usuario, Valoracion } from '../Models/types';
import { RestService } from './rest-service.service';

@Injectable()
export class DataManagementService {

  selectedProducto?: ProductoOfertado;
  selectedPedido?: PedidoComida;
  selectedCupon?: CuponDescuento;
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

  public async postProducto(producto: ProductoOfertado) {
    return await this.rest.postProducto(producto)
  }

  //MENUS
  public async getMenus(): Promise<Menu[]> {
    return await this.rest.getMenus();
  }

  //USUARIOS
  public async getAllUsuarios(): Promise<Usuario[]> {
    return await this.rest.getAllUsuarios()
  }

  public async getUsuarioById(id: number): Promise<Usuario[]> {
    return await this.rest.getUsuarioById(id)
  }

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
  public async getAllCupones(): Promise<CuponDescuento[]> {
    return await this.rest.getAllCupones()
  }

  public async getCuponDescuentoByCodigo(codigo: string): Promise<CuponDescuento[]> {
    return await this.rest.getCuponDescuentoByCodigo(codigo);
  }

  public async postCuponDescuento(cupon: CuponDescuento) {
    return await this.rest.postCuponDescuento(cupon)
  }

  public async changePercentCupon(id: number, porcentaje: number) {
    return await this.rest.changePercentCupon(id, porcentaje)
  }

  //PEDIDOS COMIDA
  public async getPedidosByUsuarioId(usuarioId: number): Promise<PedidoComida[]> {
    return await this.rest.getPedidosByUsuarioId(usuarioId);
  }

  public async getPedidoComidaById(id: number): Promise<PedidoComida> {
    return await this.rest.getPedidoComidaById(id);
  }

  public async getAllPedidos(): Promise<PedidoComida[]> {
    return await this.rest.getAllPedidos();
  }

  public async crearPedidoComida(pedido: PedidoComida): Promise<PedidoComidaResponse> {
    return await this.rest.crearPedidoComida(pedido)
  }

  public async putPedidoEnPreparacion(id: number) {
    return await this.rest.putPedidoEnPreparacion(id)
  }

  public async putPedidoEnTransito(id: number) {
    return await this.rest.putPedidoEnTransito(id)
  }

  public async putPedidoEntregado(id: number) {
    return await this.rest.putPedidoEntregado(id)
  }

  //PRODUCTOS PEDIDOS
  public async getProductosEnPedidoById(pedidoId: number): Promise<ProductoPedido[]> {
    return await this.rest.getProductosEnPedidoById(pedidoId);
  }

  public async postProductoPedido(productoPedido: ProductoPedido) {
    return await this.rest.postProductoPedido(productoPedido)
  }

  //VALORACIONES
  public async getAllValoraciones(): Promise<Valoracion[]> {
    return await this.rest.getAllValoraciones()
  }
  
  public async postValoracion(valoracion: Valoracion) {
    return await this.rest.postValoracion(valoracion)
  }

  //MESAS
  public async postReservaMesa(mesa: Mesa) {
    return await this.rest.postReservaMesa(mesa)
  }

}
