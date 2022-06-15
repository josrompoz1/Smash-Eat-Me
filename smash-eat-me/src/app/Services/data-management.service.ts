import { Injectable } from '@angular/core';
import { ProductoOfertado } from '../Models/types';
import { RestService } from './rest-service.service';

@Injectable()
export class DataManagementService {

  selectedProducto?: ProductoOfertado;

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

}
