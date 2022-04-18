import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Producto } from '../Models/producto';
import { Tipo } from '../Models/tipo';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const tipos: Tipo[] = [
      { id: 1, nombre: 'Entremés' },
      { id: 2, nombre: 'Plato' },
      { id: 3, nombre: 'Postre' },
      { id: 4, nombre: 'Bebida' }
    ]
    const productos: Producto[] = [
      { id: 1, nombre: 'Tortilla de papas', descripcion: 'Torrilla española de patatas de la huerta', precio: 5.3, tipoPlato: tipos[1]},
      { id: 2, nombre: 'Tarta de la abuela', descripcion: 'Tarda de galleta con natilla de chocolate', precio: 4.0, tipoPlato: tipos[2] },
      { id: 3, nombre: 'Ensaladilla', descripcion: 'Ensalada de patatas, mayonesa, huevo y atún', precio: 3.8, tipoPlato: tipos[0] },
      { id: 4, nombre: 'Cruzcampo', descripcion: 'Cerveza española', precio: 2.0, tipoPlato: tipos[3] },
      { id: 1, nombre: 'Tortilla de papas', descripcion: 'Torrilla española de patatas de la huerta', precio: 5.3, tipoPlato: tipos[1]},
      { id: 2, nombre: 'Tarta de la abuela', descripcion: 'Tarda de galleta con natilla de chocolate', precio: 4.0, tipoPlato: tipos[2] },
      { id: 3, nombre: 'Ensaladilla', descripcion: 'Ensalada de patatas, mayonesa, huevo y atún', precio: 3.8, tipoPlato: tipos[0] },
      { id: 1, nombre: 'Cruzcampo', descripcion: 'Cerveza española', precio: 2.0, tipoPlato: tipos[3] },
      { id: 1, nombre: 'Tortilla de papas', descripcion: 'Torrilla española de patatas de la huerta', precio: 5.3, tipoPlato: tipos[1]},
      { id: 2, nombre: 'Tarta de la abuela', descripcion: 'Tarda de galleta con natilla de chocolate', precio: 4.0, tipoPlato: tipos[2] },
      { id: 3, nombre: 'Ensaladilla', descripcion: 'Ensalada de patatas, mayonesa, huevo y atún', precio: 3.8, tipoPlato: tipos[0] },
      { id: 1, nombre: 'Cruzcampo', descripcion: 'Cerveza española', precio: 2.0, tipoPlato: tipos[3] },
      { id: 1, nombre: 'Tortilla de papas', descripcion: 'Torrilla española de patatas de la huerta', precio: 5.3, tipoPlato: tipos[1]},
      { id: 2, nombre: 'Tarta de la abuela', descripcion: 'Tarda de galleta con natilla de chocolate', precio: 4.0, tipoPlato: tipos[2] },
      { id: 3, nombre: 'Ensaladilla', descripcion: 'Ensalada de patatas, mayonesa, huevo y atún', precio: 3.8, tipoPlato: tipos[0] },
      { id: 1, nombre: 'Cruzcampo', descripcion: 'Cerveza española', precio: 2.0, tipoPlato: tipos[3] },
      { id: 1, nombre: 'Tortilla de papas', descripcion: 'Torrilla española de patatas de la huerta', precio: 5.3, tipoPlato: tipos[1]},
      { id: 2, nombre: 'Tarta de la abuela', descripcion: 'Tarda de galleta con natilla de chocolate', precio: 4.0, tipoPlato: tipos[2] },
      { id: 3, nombre: 'Ensaladilla', descripcion: 'Ensalada de patatas, mayonesa, huevo y atún', precio: 3.8, tipoPlato: tipos[0] },
      { id: 1, nombre: 'Cruzcampo', descripcion: 'Cerveza española', precio: 2.0, tipoPlato: tipos[3] }
    ];
    return {tipos, productos};
  }

  genId(productos: Producto[]): number {
    return productos.length > 0 ? Math.max(...productos.map(producto => producto.id)) + 1 : 1;
  }
  
}
