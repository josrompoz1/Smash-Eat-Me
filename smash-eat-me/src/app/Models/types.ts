import { Time } from "@angular/common";

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
    metodoPago: string;
    fecha: Date;
    hora: string;
    nombreDireccion?: string;
    estado?: string;
    usuarioId: number;
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
    cantidad: number;
    pedidoId: number;
    productoOfertadoId: number;
}