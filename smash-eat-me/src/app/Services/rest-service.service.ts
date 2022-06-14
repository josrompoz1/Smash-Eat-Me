import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoOfertado } from '../Models/types';
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

}
