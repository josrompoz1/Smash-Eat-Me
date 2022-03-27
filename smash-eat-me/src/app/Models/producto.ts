import { Tipo } from "./tipo";

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    tipoPlato: Tipo;
}