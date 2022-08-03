import { Component, OnInit } from '@angular/core';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public numberOfItems: number | undefined;
  rol: string = '';
  userLogged: boolean = false;

  constructor(private dataManagement: DataManagementService, private sesion: SesionService) {
    this.dataManagement.numberOfItemsInBasket.subscribe(value => {
      this.numberOfItems = value;
    })
    this.sesion.userLogged.subscribe(value => {
      this.userLogged = value
    })
    this.sesion.rol.subscribe(value => {
      this.rol = value
    })
  }

  ngOnInit(): void {
  }

  public cerrarSesion() {
    this.sesion.cerrarSesion()
  }

}
