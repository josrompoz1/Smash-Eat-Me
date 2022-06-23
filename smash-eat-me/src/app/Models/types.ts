export interface ProductoOfertado {
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

export interface Direccion {
    id: number;
    nombreDireccion: string;
    direccion: string;
    pais: string;
    ciudad: string;
    usuarioId: number;
}