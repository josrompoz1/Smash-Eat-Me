import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductosComponent } from './productos/productos.component';
import { InMemoryDataService } from './Services/in-memory-data.service';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
