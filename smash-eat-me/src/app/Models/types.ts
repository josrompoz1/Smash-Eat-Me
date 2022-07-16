import { Time } from "@angular/common";

export interface ProductoOfertado {
    id?: number;
    nombre: string;
    descripcion: string;
    imagen: string,
    precio: number;
    tipo: string;
    menuId?: number;
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
    id?: number;
    nombreDireccion?: string;
    direccion?: string;
    pais?: string;
    ciudad?: string;
    usuarioId?: number;
}

export interface Tarjeta {
    id?: number;
    numero?: string;
    expiracion?: Date;
    usuarioId?: number;
}

export interface CuponDescuento {
    id?: number;
    codigo?: string;
    porcentaje?: number;
}

export interface PedidoComida {
    id?: number;
    metodoPago?: string;
    fecha?: Date;
    hora?: string;
    nombreDireccion?: string;
    estado?: string;
    usuarioId?: number;
    direccionUsuarioId?: number;
}

export interface PedidoComidaResponse {
    id: number;
    status: string;
}

export interface DeleteCashRequest {
    creditoDigital: number;
}

export interface  ProductoPedido {
    id?: number;
    cantidad: number;
    pedidoId: number;
    productoOfertadoId: number;
}

export interface Valoracion {
    id?: number;
    puntuacion: number;
    resenya: string;
    nombreUsuario: string;
    nombreProducto: string;
    usuarioId: number;
    productoPedidoId: number;
}

export interface ValoracionResponse {
    puntuacion: number;
    resenya: string;
    usuarioId: number;
    productoOfertadoId: number;
}

export interface Menu {
    id?: number;
    nombre: string;
    descripcion: string;
    precio?: number;
}

export interface Mesa {
    id?: number;
    numeroPersonas: number;
    fecha: Date;
    hora: string;
    precioDescuento?: number;
    usuarioId: number;
    menuId: number;
}

export interface Reto {
    id?: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    dificultad: number;
    completado: boolean;
}

export interface Solucion {
    id: number;
    nombre: string;
    tipo: string;
    retoId: number;
}

export interface Paso {
    id: number;
    numero: number;
    solucion: string;
    solucionId: number;
}