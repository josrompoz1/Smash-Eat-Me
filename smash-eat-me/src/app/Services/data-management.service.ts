import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CuponDescuento, Direccion, ProductoOfertado, Tarjeta } from '../Models/types';
import { RestService } from './rest-service.service';

@Injectable()
export class DataManagementService {

  selectedProducto?: ProductoOfertado;
  public numberOfItemsInBasket: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public productosEnCesta: BehaviorSubject<ProductoOfertado[]> = new BehaviorSubject<ProductoOfertado[]>([]);
  public direccionSeleccionada: BehaviorSubject<Direccion> | undefined;
  public horaSeleccionada: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public tarjetaSeleccionada: BehaviorSubject<Tarjeta> | undefined;
  public seleccionadoCreditoDigital: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private rest: RestService) { }

  //PRODUCTOS
  public async getProductos(): Promise<ProductoOfertado[]> {
    return await this.rest.getProductos();
  }

  public async getProductosPorBusqueda(busqueda: string): Promise<ProductoOfertado[]> {
    return await this.rest.getProductosPorBusqueda(busqueda);
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

  //CUPONES DESCUENTO
  public async getCuponDescuentoByCodigo(codigo: string): Promise<CuponDescuento[]> {
    return await this.rest.getCuponDescuentoByCodigo(codigo);
  }

}
