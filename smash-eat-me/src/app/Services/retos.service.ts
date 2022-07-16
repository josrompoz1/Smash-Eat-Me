import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Paso, Reto, Solucion } from '../Models/types';
import { RestService } from './rest-service.service';

@Injectable({
  providedIn: 'root'
})
export class RetosService {

  public paramDificultad: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public paramCategoria: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public retoIdSeleccionado: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private rest: RestService) { }

  //RETOS
  public async getAllRetos(): Promise<Reto[]> {
    return await this.rest.getAllRetos()
  }

  public async getRetoById(id: number): Promise<Reto> {
    return await this.rest.getRetoById(id)
  }

  public async countAllRetos(): Promise<number> {
    return await this.rest.countAllRetos()
  }

  public async countRetosCompletados(): Promise<number> {
    return await this.rest.countRetosCompletados()
  }

  public async getRetosFilterByCategoria(categoria: string): Promise<Reto[]> {
    return await this.rest.getRetosFilterByCategoria(categoria)
  }

  public async getRetosFilterByDificultad(minimo: number, maximo: number): Promise<Reto[]> {
    return await this.rest.getRetosFilterByDificultad(minimo, maximo)
  }

  public async getRetosFilterByCategoriaAndDificultad(categoria: string, minimo: number, maximo: number): Promise<Reto[]> {
    return await this.rest.getRetosFilterByCategoriaAndDificultad(categoria, minimo, maximo)
  }

  //SOLUCIONES
  public async getSolucionesByRetoId(retoId: number): Promise<Solucion[]> {
    return await this.rest.getSolucionesByRetoId(retoId)
  }

  //PASOS
  public async getPasosBySolucionId(solucionId: number): Promise<Paso[]> {
    return await this.rest.getPasosBySolucionId(solucionId)
  }

}
