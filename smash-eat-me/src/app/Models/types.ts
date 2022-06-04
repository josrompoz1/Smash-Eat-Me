export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string,
    precio: number;
    tipo: string;
    menuId: number;
}

export interface Usuario {
    id: number;
    username: string;
    nombre: string;
    correo: string;
    contraseña: string;
    tipo: string;
    creditoDigital: number;
    telefono: number;
}