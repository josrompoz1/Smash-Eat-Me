import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CestaComponent } from './components/cesta/cesta.component';
import { DireccionUsuarioComponent } from './components/direccion-usuario/direccion-usuario.component';
import { ProductosComponent } from './components/productos/productos.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';

const routes: Routes = [
  { path: '', component: ProductosComponent },
  { path: 'registro', component: RegistroUsuarioComponent },
  { path: 'cesta', component: CestaComponent, children: [
    { path: 'direccion', component: DireccionUsuarioComponent }
  ]}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
