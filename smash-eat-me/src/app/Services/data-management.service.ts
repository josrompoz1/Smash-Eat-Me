import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CuponDescuento, DeleteCashRequest, Direccion, Login, LoginResponse, Menu, Mesa, PedidoComida, PedidoComidaResponse, ProductoOfertado, ProductoPedido, Tarjeta, Usuario, Valoracion, ValoracionResponse } from '../Models/types';
import { RestService } from './rest-service.service';

@Injectable()
export class DataManagementService {

  selectedProducto?: ProductoOfertado;
  selectedPedido?: PedidoComida;
  selectedCupon?: CuponDescuento;
  selectedMenu?: Menu;
  selectedUsuarioId?: number;
  public numberOfItemsInBasket: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public productosEnCesta: BehaviorSubject<ProductoOfertado[]> = new BehaviorSubject<ProductoOfertado[]>([]);
  public direccionSeleccionada: BehaviorSubject<Direccion> = new BehaviorSubject<Direccion>({});
  public horaSeleccionada: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public tarjetaSeleccionada: BehaviorSubject<Tarjeta> = new BehaviorSubject<Tarjeta>({});
  public seleccionadoCreditoDigital: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public precioPedido: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public descuentoAplicado: BehaviorSubject<CuponDescuento> = new BehaviorSubject<CuponDescuento>({});

  public paramTipo: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public paramBusqueda: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private rest: RestService) {
    let numeroItemsEnCesta = localStorage.getItem('numberOfItemsInBasket')
    if(numeroItemsEnCesta) this.numberOfItemsInBasket.next(JSON.parse(numeroItemsEnCesta))
    let productosCesta = localStorage.getItem('productosEnCesta')
    if(productosCesta) this.productosEnCesta.next(JSON.parse(productosCesta))
    let direccion = localStorage.getItem('direccionSeleccionada')
    if(direccion) this.direccionSeleccionada.next(JSON.parse(direccion))
    let hora = localStorage.getItem('horaSeleccionada')
    if(hora) this.horaSeleccionada.next(hora)
    let precio = localStorage.getItem('precioPedido')
    if(precio) this.precioPedido.next(JSON.parse(precio))
    let tarjeta = localStorage.getItem('tarjetaSeleccionada')
    if(tarjeta) this.tarjetaSeleccionada.next(JSON.parse(tarjeta))
    let credito = localStorage.getItem('seleccionadoCreditoDigital')
    if(credito) this.seleccionadoCreditoDigital.next(JSON.parse(credito))
    let cupon = localStorage.getItem('descuentoAplicado')
    if(cupon) this.descuentoAplicado.next(JSON.parse(cupon))
  }

  //LOGIN
  public async login(login: Login): Promise<LoginResponse> {
    return await this.rest.login(login)
  }

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

  public async getProductosByMenuId(menuId: number): Promise<ProductoOfertado[]> {
    return await this.rest.getProductosByMenuId(menuId)
  }

  public async getProductosSinMenuId(): Promise<ProductoOfertado[]> {
    return await this.rest.getProductosSinMenuId()
  }

  public async getProductosPorTipo(tipo: string): Promise<ProductoOfertado[]> {
    return await this.rest.getProductosPorTipo(tipo)
  }

  public async getProductosFilterByTipoAndNombre(tipo: string, busqueda: string): Promise<ProductoOfertado[]> {
    return await this.rest.getProductosFilterByTipoAndNombre(tipo, busqueda)
  }

  public async postProducto(producto: ProductoOfertado) {
    return await this.rest.postProducto(producto)
  }

  public async editarProducto(id: number, producto: ProductoOfertado) {
    return await this.rest.editarProducto(id, producto)
  }

  public async putMenuIdInProducto(productoId: number, menuId: number) {
    return await this.rest.putMenuIdInProducto(productoId, menuId)
  }

  public async deleteProducto(productoId: number) {
    return await this.rest.deleteProducto(productoId)
  }

  //MENUS
  public async getMenus(): Promise<Menu[]> {
    return await this.rest.getMenus();
  }

  public async postMenu(menu: Menu) {
    return await this.rest.postMenu(menu)
  }

  public async deleteMenu(id: number) {
    return await this.rest.deleteMenu(id)
  }

  //USUARIOS
  public async getAllUsuarios(): Promise<Usuario[]> {
    return await this.rest.getAllUsuarios()
  }

  public async getUsuarioById(id: number): Promise<Usuario> {
    return await this.rest.getUsuarioById(id)
  }

  public async crearUsuario(usuario: any) {
    return await this.rest.crearUsuario(usuario);
  }

  public async updateUsuario(usuario: Usuario, id: number) {
    return await this.rest.updateUsuario(usuario, id)
  }

  public async deleteUsuario(id: number) {
    return await this.rest.deleteUsuario(id)
  }

  public async getDireccionesUsuario(id: number): Promise<Direccion[]> {
    return await this.rest.getDireccionesUsuario(id);
  }

  public async crearDireccion(direccion: any) {
    return await this.rest.crearDireccion(direccion);
  }

  public async editarDireccion(direccion: Direccion, id: number) {
    return await this.rest.editarDireccion(direccion, id)
  }

  public async deleteDireccion(id: number) {
    return await this.rest.deleteDireccion(id)
  }

  public async getTarjetasUsuario(usuarioId: number): Promise<Tarjeta[]> {
    return await this.rest.getTarjetasUsuario(usuarioId);
  }

  public async crearTarjeta(tarjeta: any) {
    return await this.rest.crearTarjeta(tarjeta);
  }

  public async editarTarjeta(tarjeta: Tarjeta, id: number) {
    return await this.rest.editarTarjeta(tarjeta, id)
  }

  public async deleteTarjeta(id: number) {
    return await this.rest.deleteTarjeta(id)
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

  public async deleteCupon(id: number) {
    return await this.rest.deleteCupon(id)
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

  public async getValoracionesWithProductoId(id: number): Promise<ValoracionResponse[]> {
    return await this.rest.getValoracionesWithProductoId(id)
  }

  public async getValoracionesByUsuarioId(usuarioId: number): Promise<Valoracion[]> {
    return await this.rest.getValoracionesByUsuarioId(usuarioId)
  }
  
  public async postValoracion(valoracion: Valoracion) {
    return await this.rest.postValoracion(valoracion)
  }

  public async deleteValoracion(id: number) {
    return await this.rest.deleteValoracion(id)
  }

  //MESAS
  public async getAllMesas(): Promise<Mesa[]> {
    return await this.rest.getAllMesas()
  }

  public async getMesaByUsuarioId(usuarioId: number): Promise<Mesa[]> {
    return await this.rest.getMesaByUsuarioId(usuarioId)
  }

  public async postReservaMesa(mesa: Mesa) {
    return await this.rest.postReservaMesa(mesa)
  }

  public async deleteReserva(id: number) {
    return await this.rest.deleteReserva(id)
  }

}
