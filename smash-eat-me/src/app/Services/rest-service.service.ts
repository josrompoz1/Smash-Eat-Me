import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CuponDescuento, DeleteCashRequest, Direccion, Login, LoginResponse, Menu, Mesa, Paso, PedidoComida, PedidoComidaResponse, Pista, ProductoOfertado, ProductoPedido, Reto, Solucion, Tarjeta, Usuario, Valoracion, ValoracionResponse } from '../Models/types';
import { AbstractWebService } from './abstract-web-service.service';

@Injectable()
export class RestService extends AbstractWebService {

  constructor(http: HttpClient) {
    super(http);
  }

  private url = 'http://localhost:8080/';

  //LOGIN
  public async login(login: Login): Promise<LoginResponse> {
    return await this.makePostRequest(this.url + 'signin', login)
  }

  //PRODUCTOS
  public async getProductos(): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos');
  }

  public async getProductosPorBusqueda(busqueda: string): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos/busqueda/' + busqueda);
  }

  public async getProductosById(id: number): Promise<ProductoOfertado> {
    return await this.makeGetRequest(this.url + 'productos/porId/' + id);
  }

  public async getProductosByMenuId(menuId: number): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos/menu/' + menuId)
  }

  public async getProductosSinMenuId(): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos/no/menu')
  }

  public async getProductosPorTipo(tipo: string): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos/tipo/' + tipo)
  }

  public async getProductosFilterByTipoAndNombre(tipo: string, busqueda: string): Promise<ProductoOfertado[]> {
    return await this.makeGetRequest(this.url + 'productos/tipo/' + tipo + '/busqueda/' + busqueda)
  }

  public async postProducto(producto: ProductoOfertado) {
    return await this.makePostRequest(this.url + 'productos', producto)
  }

  public async editarProducto(id: number, producto: ProductoOfertado) {
    return await this.makePutRequest(this.url + 'productos/' + id, producto)
  }

  public async putMenuIdInProducto(productoId: number, menuId: number) {
    return await this.makePutRequest(this.url + 'productos/' + productoId + '/menu/' + menuId, null)
  }

  public async deleteProducto(productoId: number) {
    return await this.makeDeleteRequest(this.url + 'productos/' + productoId)
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

  public async getUsuarioById(id: number): Promise<Usuario> {
    return await this.makeGetRequest(this.url + 'usuarios/' + id)
  }

  public async crearUsuario(usuario: any) {
    return await this.makePostRequest(this.url + 'usuarios', usuario);
  }

  public async updateUsuario(usuario: Usuario, id: number) {
    return await this.makePutRequest(this.url + 'usuarios/' + id, usuario)
  }

  public async deleteUsuario(id: number) {
    return await this.makeDeleteRequest(this.url + 'usuarios/' + id)
  }

  public async getDireccionesUsuario(id: number): Promise<Direccion[]> {
    return await this.makeGetRequest(this.url + 'direcciones/usuario/' + id);
  }

  public async crearDireccion(direccion: any) {
    return await this.makePostRequest(this.url + 'direcciones', direccion);
  }

  public async editarDireccion(direccion: Direccion, id: number) {
    return await this.makePutRequest(this.url + 'direcciones/' + id, direccion)
  }

  public async deleteDireccion(id: number) {
    return await this.makeDeleteRequest(this.url + 'direcciones/' + id)
  }

  public async getTarjetasUsuario(usuarioId: number): Promise<Tarjeta[]> {
    return await this.makeGetRequest(this.url + 'tarjetas/usuario/' + usuarioId);
  }

  public async crearTarjeta(tarjeta: any) {
    return await this.makePostRequest(this.url + 'tarjetas', tarjeta);
  }

  public async editarTarjeta(tarjeta: Tarjeta, id: number) {
    return await this.makePutRequest(this.url + 'tarjetas/' + id, tarjeta)
  }

  public async deleteTarjeta(id: number) {
    return await this.makeDeleteRequest(this.url + 'tarjetas/' + id)
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

  public async getValoracionById(valoracionId: number): Promise<Valoracion> {
    return await this.makeGetRequest(this.url + 'valoraciones/' + valoracionId)
  }

  public async getValoracionesWithProductoId(id: number): Promise<ValoracionResponse[]> {
    return await this.makeGetRequest(this.url + 'valoraciones/producto/' + id)
  }

  public async getValoracionesByUsuarioId(usuarioId: number): Promise<Valoracion[]> {
    return await this.makeGetRequest(this.url + 'valoraciones/usuario/' + usuarioId)
  }

  public async postValoracion(valoracion: Valoracion) {
    return await this.makePostRequest(this.url + 'valoraciones', valoracion);
  }

  public async deleteValoracion(id: number) {
    return await this.makeDeleteRequest(this.url + 'valoraciones/' + id)
  }

  //MESAS
  public async getAllMesas(): Promise<Mesa[]> {
    return await this.makeGetRequest(this.url + 'mesas')
  }

  public async getMesaByUsuarioId(usuarioId: number): Promise<Mesa[]> {
    return await this.makeGetRequest(this.url + 'mesas/usuario/' + usuarioId)
  }

  public async postReservaMesa(mesa: Mesa) {
    return await this.makePostRequest(this.url + 'mesas', mesa)
  }

  public async deleteReserva(id: number) {
    return await this.makeDeleteRequest(this.url+ 'mesas/' + id)
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

  public async finishReto(retoId: number) {
    return await this.makePutRequest(this.url + 'retos/' + retoId + '/setfinished', null)
  }

  //SOLUCIONES
  public async getSolucionesByRetoId(retoId: number): Promise<Solucion[]> {
    return await this.makeGetRequest(this.url + 'soluciones/reto/' + retoId);
  }

  //PASOS
  public async getPasosBySolucionId(solucionId: number): Promise<Paso[]> {
    return await this.makeGetRequest(this.url + 'pasos/solucion/' + solucionId)
  }

  //PISTAS
  public async getPistaByRetoId(retoId: number): Promise<Pista[]> {
    return await this.makeGetRequest(this.url + 'pista/reto/' + retoId)
  }

}
