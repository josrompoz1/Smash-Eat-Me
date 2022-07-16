import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CuponDescuento, DeleteCashRequest, Direccion, Menu, Mesa, Paso, PedidoComida, PedidoComidaResponse, ProductoOfertado, ProductoPedido, Reto, Solucion, Tarjeta, Usuario, Valoracion, ValoracionResponse } from '../Models/types';
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

  public async getProductosByMenuId(menuId: number): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos/menu/' + menuId)
  }

  public async getProductosSinMenuId(): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos/no/menu')
  }

  public async postProducto(producto: ProductoOfertado) {
    return await this.makePostRequest(this.url + 'productos', producto)
  }

  public async putMenuIdInProducto(productoId: number, menuId: number) {
    return await this.makePutRequest(this.url + 'productos/' + productoId + '/menu/' + menuId, null)
  }

  //MENU
  public async getMenus(): Promise<Menu[]> {
    return await this.makeGetRequest(this.url + 'menus');
  }

  public async postMenu(menu: Menu) {
    return await this.makePostRequest(this.url + 'menus', menu)
  }

  public async deleteMenu(id: number) {
    return await this.makeDeleteRequest(this.url + 'menus/' + id)
  }

  //USUARIOS
  public async getAllUsuarios(): Promise<Usuario[]> {
    return await this.makeGetRequest(this.url+ 'usuarios');
  }

  public async getUsuarioById(id: number): Promise<Usuario[]> {
    return await this.makeGetRequest(this.url + 'usuarios/' + id)
  }

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
  public async getAllCupones(): Promise<CuponDescuento[]> {
    return await this.makeGetRequest(this.url + 'cupones')
  }

  public async getCuponDescuentoByCodigo(codigo: string): Promise<CuponDescuento[]> {
    return await this.makeGetRequest(this.url + 'cupones/codigo/' + codigo);
  }

  public async postCuponDescuento(cupon: CuponDescuento) {
    return await this.makePostRequest(this.url + 'cupones', cupon)
  }

  public async changePercentCupon(id: number, porcentaje: number) {
    return await this.makePutRequest(this.url + 'cupones/' + id + '/changepercent/' + porcentaje, null)
  }

  public async deleteCupon(id: number) {
    return await this.makeDeleteRequest(this.url + 'cupones/' + id)
  }

  //PEDIDOS COMIDA
  public async getPedidosByUsuarioId(usuarioId: number): Promise<PedidoComida[]> {
    return await this.makeGetRequest(this.url + 'pedidos/usuario/' + usuarioId)
  }

  public async getPedidoComidaById(id: number): Promise<PedidoComida> {
    return await this.makeGetRequest(this.url + 'pedidos/' + id)
  }

  public async getAllPedidos(): Promise<PedidoComida[]> {
    return await this.makeGetRequest(this.url + 'pedidos')
  }

  public async crearPedidoComida(pedido: PedidoComida): Promise<PedidoComidaResponse> {
    return await this.makePostRequest(this.url + 'pedidos', pedido);
  }

  public async putPedidoEnPreparacion(id: number) {
    return await this.makePutRequest(this.url + 'pedidos/preparacion/' + id, null)
  }

  public async putPedidoEnTransito(id: number) {
    return await this.makePutRequest(this.url + 'pedidos/transito/' + id, null)
  }

  public async putPedidoEntregado(id: number) {
    return await this.makePutRequest(this.url + 'pedidos/entregado/' + id, null)
  }

  //PRODUCTOS PEDIDOS
  public async getProductosEnPedidoById(pedidoId: number): Promise<ProductoPedido[]> {
    return await this.makeGetRequest(this.url + "productospedidos/" + pedidoId);
  }

  public async postProductoPedido(productoPedido: ProductoPedido) {
    return await this.makePostRequest(this.url + 'productospedidos', productoPedido);
  }

  //VALORACIONES
  public async getAllValoraciones(): Promise<Valoracion[]> {
    return await this.makeGetRequest(this.url + 'valoraciones')
  }

  public async getValoracionesWithProductoId(id: number): Promise<ValoracionResponse[]> {
    return await this.makeGetRequest(this.url + 'valoraciones/producto/' + id)
  }

  public async postValoracion(valoracion: Valoracion) {
    return await this.makePostRequest(this.url + 'valoraciones', valoracion);
  }

  //MESAS
  public async postReservaMesa(mesa: Mesa) {
    return await this.makePostRequest(this.url + 'mesas', mesa)
  }

  //RETOS
  public async getAllRetos(): Promise<Reto[]> {
    return await this.makeGetRequest(this.url + 'retos')
  }

  public async getRetoById(id: number): Promise<Reto> {
    return await this.makeGetRequest(this.url + 'retos/' + id)
  }

  public async countAllRetos(): Promise<number> {
    return await this.makeGetRequest(this.url + 'retos/count/todos')
  }

  public async countRetosCompletados(): Promise<number> {
    return await this.makeGetRequest(this.url + 'retos/count/completados')
  }

  public async getRetosFilterByCategoria(categoria: string): Promise<Reto[]> {
    return await this.makeGetRequest(this.url + 'retos/categoria/' + categoria)
  }

  public async getRetosFilterByDificultad(minimo: number, maximo: number): Promise<Reto[]> {
    return await this.makeGetRequest(this.url + 'retos/dificultad/' + minimo + '/' + maximo)
  }

  public async getRetosFilterByCategoriaAndDificultad(categoria: string, minimo: number, maximo: number): Promise<Reto[]> {
    return await this.makeGetRequest(this.url + 'retos/categoria/' + categoria + '/dificultad/' + minimo + '/' + maximo)
  }

  //SOLUCIONES
  public async getSolucionesByRetoId(retoId: number): Promise<Solucion[]> {
    return await this.makeGetRequest(this.url + 'soluciones/reto/' + retoId);
  }

  //PASOS
  public async getPasosBySolucionId(solucionId: number): Promise<Paso[]> {
    return await this.makeGetRequest(this.url + 'pasos/solucion/' + solucionId)
  }

}
