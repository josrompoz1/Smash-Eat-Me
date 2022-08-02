import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductosComponent } from './components/productos/productos.component';
import { HeaderComponent } from './components/header/header.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductosDialogComponent } from './components/productos-dialog/productos-dialog.component';
import { PaginatePipe } from './pipes/paginate.pipe';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { ServerResponseInterceptor } from './interceptors/server-response.interceptor';
import { RestService } from './Services/rest-service.service';
import { DataManagementService } from './Services/data-management.service';
import { ToastrModule } from 'ngx-toastr';
import { MatBadgeModule } from '@angular/material/badge';
import { CestaComponent } from './components/cesta/cesta.component';
import { DireccionUsuarioComponent } from './components/direccion-usuario/direccion-usuario.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AddDirecionComponent } from './components/add-direcion/add-direcion.component';
import { HoraEntregaComponent } from './components/hora-entrega/hora-entrega.component';
import { MetodoPagoComponent } from './components/metodo-pago/metodo-pago.component';
import { AddTarjetaComponent } from './components/add-tarjeta/add-tarjeta.component';
import { AddCreditoComponent } from './components/add-credito/add-credito.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { HistorialPedidosComponent } from './components/historial-pedidos/historial-pedidos.component';
import { MatTableModule } from '@angular/material/table';
import { ValoracionComponent } from './components/valoracion/valoracion.component'
import { ValoracionService } from './Services/valoracion.service';
import { ValoracionDialogComponent } from './components/valoracion-dialog/valoracion-dialog.component';
import { ReservarMesaComponent } from './components/reservar-mesa/reservar-mesa.component';
import { ListadoUsuariosComponent } from './components/listado-usuarios/listado-usuarios.component';
import { PedidoDialogComponent } from './components/pedido-dialog/pedido-dialog.component';
import { AddProductoComponent } from './components/add-producto/add-producto.component';
import { ListadoCuponesDescuentoComponent } from './components/listado-cupones-descuento/listado-cupones-descuento.component';
import { CuponDescuentoDialogComponent } from './components/cupon-descuento-dialog/cupon-descuento-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardDialogComponent } from './components/dashboard-dialog/dashboard-dialog.component';
import { SolucionesRetoDialogComponent } from './components/soluciones-reto-dialog/soluciones-reto-dialog.component';
import { ListadoMenusComponent } from './components/listado-menus/listado-menus.component';
import { DetallesMenuDialogComponent } from './components/detalles-menu-dialog/detalles-menu-dialog.component';
import { MenuDialogComponent } from './components/menu-dialog/menu-dialog.component';
import { EditProductoComponent } from './components/edit-producto/edit-producto.component';
import { FiltroProductosComponent } from './components/filtro-productos/filtro-productos.component';
import { HistorialMesasComponent } from './components/historial-mesas/historial-mesas.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { ChallengesInterceptor } from './interceptors/challenges.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    HeaderComponent,
    ProductosDialogComponent,
    PaginatePipe,
    RegistroUsuarioComponent,
    CestaComponent,
    DireccionUsuarioComponent,
    AddDirecionComponent,
    HoraEntregaComponent,
    MetodoPagoComponent,
    AddTarjetaComponent,
    AddCreditoComponent,
    PedidoComponent,
    HistorialPedidosComponent,
    ValoracionComponent,
    ValoracionDialogComponent,
    ReservarMesaComponent,
    ListadoUsuariosComponent,
    PedidoDialogComponent,
    AddProductoComponent,
    ListadoCuponesDescuentoComponent,
    CuponDescuentoDialogComponent,
    FooterComponent,
    DashboardComponent,
    DashboardDialogComponent,
    SolucionesRetoDialogComponent,
    ListadoMenusComponent,
    DetallesMenuDialogComponent,
    MenuDialogComponent,
    EditProductoComponent,
    FiltroProductosComponent,
    HistorialMesasComponent,
    PerfilUsuarioComponent,
    InicioSesionComponent
  ],
  imports: [
    MatBadgeModule,
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTableModule,
    MatSelectModule,
    MatProgressBarModule,
    MatMenuModule,
    MatExpansionModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    RestService,
    DataManagementService,
    ValoracionService,
    { provide: HTTP_INTERCEPTORS, useClass: ServerResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ChallengesInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
