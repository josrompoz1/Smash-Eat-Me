import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Direccion, ProductoOfertado } from '../Models/types';
import { RestService } from './rest-service.service';

@Injectable()
export class DataManagementService {

  selectedProducto?: ProductoOfertado;
  public numberOfItemsInBasket: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public productosEnCesta: BehaviorSubject<ProductoOfertado[]> = new BehaviorSubject<ProductoOfertado[]>([]);

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

}
