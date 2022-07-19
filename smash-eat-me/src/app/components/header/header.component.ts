import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public numberOfItems: number | undefined;
  rol: string = 'ADMIN';

  constructor(private dataManagement: DataManagementService, private sesion: SesionService) {
    this.dataManagement.numberOfItemsInBasket.subscribe(value => {
      this.numberOfItems = value;
    })
  }

  ngOnInit(): void {
  }

  public cerrarSesion() {
    this.sesion.cerrarSesion()
  }

}
