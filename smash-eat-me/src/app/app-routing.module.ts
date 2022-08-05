import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCreditoComponent } from './components/add-credito/add-credito.component';
import { AddDirecionComponent } from './components/add-direcion/add-direcion.component';
import { AddProductoComponent } from './components/add-producto/add-producto.component';
import { AddTarjetaComponent } from './components/add-tarjeta/add-tarjeta.component';
import { CestaComponent } from './components/cesta/cesta.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DireccionUsuarioComponent } from './components/direccion-usuario/direccion-usuario.component';
import { HistorialMesasComponent } from './components/historial-mesas/historial-mesas.component';
import { HistorialPedidosComponent } from './components/historial-pedidos/historial-pedidos.component';
import { HoraEntregaComponent } from './components/hora-entrega/hora-entrega.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { ListadoCuponesDescuentoComponent } from './components/listado-cupones-descuento/listado-cupones-descuento.component';
import { ListadoMenusComponent } from './components/listado-menus/listado-menus.component';
import { ListadoUsuariosComponent } from './components/listado-usuarios/listado-usuarios.component';
import { MetodoPagoComponent } from './components/metodo-pago/metodo-pago.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { ProductosComponent } from './components/productos/productos.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { ReservarMesaComponent } from './components/reservar-mesa/reservar-mesa.component';
import { ValoracionComponent } from './components/valoracion/valoracion.component';
import { SesionService } from './Services/sesion.service';

const routes: Routes = [
  { path: '', component: ProductosComponent },
  { path: 'registro', component: RegistroUsuarioComponent },
  { path: 'cesta', component: CestaComponent },
  { path: 'direccion', component: AddDirecionComponent },
  { path: 'tarjeta', component: AddTarjetaComponent },
  { path: 'creditodigital', component: AddCreditoComponent },
  { path: 'pedido', component: PedidoComponent },
  { path: 'historialpedidos', component: HistorialPedidosComponent },
  { path: 'valoracion', component: ValoracionComponent },
  { path: 'reservamesa', component: ReservarMesaComponent },
  { path: 'listadousuarios', component: ListadoUsuariosComponent },
  { path: 'crearproducto', component: AddProductoComponent, canActivate: [SesionService] },
  { path: 'listadocupones', component: ListadoCuponesDescuentoComponent },
  { path: 'menus', component: ListadoMenusComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'historialmesas', component: HistorialMesasComponent },
  { path: 'usuario', component: PerfilUsuarioComponent },
  { path: 'signin', component: InicioSesionComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
