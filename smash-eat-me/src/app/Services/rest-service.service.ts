import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CuponDescuento, DeleteCashRequest, Direccion, PedidoComida, PedidoComidaResponse, ProductoOfertado, ProductoPedido, Tarjeta } from '../Models/types';
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
    return this.makeGetRequest(this.url + 'cupones/codigo/' + codigo);
  }

  //PEDIDOS COMIDA
  public async crearPedidoComida(pedido: PedidoComida): Promise<PedidoComidaResponse> {
    return this.makePostRequest(this.url + 'pedidos', pedido);
  }

  public async postProductoPedido(productoPedido: ProductoPedido) {
    return this.makePostRequest(this.url + 'productospedidos', productoPedido);
  }

}
