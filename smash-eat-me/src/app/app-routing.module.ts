import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDirecionComponent } from './components/add-direcion/add-direcion.component';
import { CestaComponent } from './components/cesta/cesta.component';
import { DireccionUsuarioComponent } from './components/direccion-usuario/direccion-usuario.component';
import { ProductosComponent } from './components/productos/productos.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';

const routes: Routes = [
  { path: '', component: ProductosComponent },
  { path: 'registro', component: RegistroUsuarioComponent },
  { path: 'cesta', component: CestaComponent, children: [
    { path: 'direccion', component: DireccionUsuarioComponent }
  ]},
  { path: 'direccion', component: AddDirecionComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
