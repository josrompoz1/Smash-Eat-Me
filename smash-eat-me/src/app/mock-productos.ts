import { Producto } from "./producto";
import { TIPOS } from "./mock-tipos";

export const PRODUCTOS: Producto[] = [
    { id: 1, nombre: 'Tortilla de papas', descripcion: 'Torrilla española de patatas de la huerta', precio: 5.3, tipoPlato: TIPOS[1]},
    { id: 2, nombre: 'Tarta de la abuela', descripcion: 'Tarda de galleta con natilla de chocolate', precio: 4.0, tipoPlato: TIPOS[2] },
    { id: 3, nombre: 'Ensaladilla', descripcion: 'Ensalada de patatas, mayonesa, huevo y atún', precio: 3.8, tipoPlato: TIPOS[0] },
    { id: 1, nombre: 'Cruzcampo', descripcion: 'Cerveza española', precio: 2.0, tipoPlato: TIPOS[3] }
];