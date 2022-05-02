export interface Tipo {
    id: number;
    nombre: string;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string,
    precio: number;
    tipo: string;
    menuId: number;
}