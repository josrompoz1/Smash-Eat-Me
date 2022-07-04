import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PedidoComida } from '../Models/types';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {

  public pedidoAValorar: BehaviorSubject<PedidoComida> = new BehaviorSubject<PedidoComida>({});

  constructor() { }

}
