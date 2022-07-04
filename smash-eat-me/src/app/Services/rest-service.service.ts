import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CuponDescuento, DeleteCashRequest, Direccion, Menu, PedidoComida, PedidoComidaResponse, ProductoOfertado, ProductoPedido, Tarjeta, Valoracion } from '../Models/types';
import { AbstractWebService } from './abstract-web-service.service';

@Injectable()
export class RestService extends AbstractWebService {

  constructor(http: HttpClient) {
    super(http);
  }

  private url = 'http://localhost:8080/';

  //PRODUCTOS
  public async getProductos(): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos');
  }

  public async getProductosPorBusqueda(busqueda: string): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos/busqueda/' + busqueda);
  }

  public async getProductosById(id: number): Promise<ProductoOfertado> {
    return await this.makeGetRequest(this.url + 'productos/' + id);
  }

  //MENU
  public async getMenus(): Promise<Menu[]> {
    return await this.makeGetRequest(this.url + 'menus');
  }

  //USUARIOS
  public async crearUsuario(usuario: any) {
    return await this.makePostRequest(this.url + 'usuarios', usuario);
  }

  public async getDireccionesUsuario(id: number): Promise<Direccion[]> {
    return await this.makeGetRequest(this.url + 'direcciones/usuario/' + id);
  }

  public async crearDireccion(direccion: any) {
    return await this.makePostRequest(this.url + 'direcciones', direccion);
  }

  public async getTarjetasUsuario(usuarioId: number): Promise<Tarjeta[]> {
    return await this.makeGetRequest(this.url + 'tarjetas/usuario/' + usuarioId);
  }

  public async crearTarjeta(tarjeta: any) {
    return await this.makePostRequest(this.url + 'tarjetas', tarjeta);
  }

  public async getCreditoDigital(usuarioId: number): Promise<number> {
    return await this.makeGetRequest(this.url + 'usuarios/cartera/' + usuarioId);
  }

  public async addCreditoDigital(usuarioId: number, credito: number) {
    return await this.makePutRequest(this.url + 'usuarios/' + usuarioId + '/addcash/' + credito, null);
  }

  public async deleteCreditoDigital(usuarioId: number, credito: DeleteCashRequest) {
    return await this.makePutRequest(this.url + 'usuarios/' + usuarioId + '/deletecash', credito);
  }

  //CUPONES DESCUENTO
  public async getCuponDescuentoByCodigo(codigo: string): Promise<CuponDescuento[]> {
    return await this.makeGetRequest(this.url + 'cupones/codigo/' + codigo);
  }

  //PEDIDOS COMIDA
  public async getPedidosByUsuarioId(usuarioId: number): Promise<PedidoComida[]> {
    return await this.makeGetRequest(this.url + 'pedidos/usuario/' + usuarioId)
  }

  public async getPedidoComidaById(id: number): Promise<PedidoComida> {
    return await this.makeGetRequest(this.url + 'pedidos/' + id)
  }

  public async crearPedidoComida(pedido: PedidoComida): Promise<PedidoComidaResponse> {
    return await this.makePostRequest(this.url + 'pedidos', pedido);
  }

  //PRODUCTOS PEDIDOS
  public async getProductosEnPedidoById(pedidoId: number): Promise<ProductoPedido[]> {
    return await this.makeGetRequest(this.url + "productospedidos/" + pedidoId);
  }

  public async postProductoPedido(productoPedido: ProductoPedido) {
    return await this.makePostRequest(this.url + 'productospedidos', productoPedido);
  }

  //VALORACIONES
  public async postValoracion(valoracion: Valoracion) {
    return await this.makePostRequest(this.url + 'valoraciones', valoracion);
  }

}
