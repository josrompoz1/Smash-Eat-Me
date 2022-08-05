import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccion, ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-direccion-usuario',
  templateUrl: './direccion-usuario.component.html',
  styleUrls: ['./direccion-usuario.component.css', '../styles.css']
})
export class DireccionUsuarioComponent implements OnInit {

  public direcciones: Direccion[] = [];
  direccionSeleccionadaIndex: number = -1;
  direccionSeleccioinada!: Direccion;
  productosEnCesta: ProductoOfertado[] = [];
  userId: number = 0
  disableButton: boolean = true;
  disableCheckbox = false;
  enableHora: boolean = false;

  constructor(private dataManagement: DataManagementService,
    private router: Router,
    private sesionService: SesionService) {

    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosEnCesta = value;
    })
    this.dataManagement.direccionSeleccionada.subscribe(value => {
      this.direccionSeleccioinada = value;
    })
    this.sesionService.userId.subscribe(value => {
      this.userId = value;
    })
  }

  ngOnInit(): void {
    if (this.userId > 0) {
      this.getData()
    } else {
      this.router.navigate(['cesta'])
    }
  }

  private async getData() {
    this.direcciones = await this.dataManagement.getDireccionesUsuario(this.userId);
    let i = 0;
    this.direcciones.forEach(direccion => {
      if (direccion.id == this.direccionSeleccioinada.id) {
        this.direccionSeleccionadaIndex = i
        this.disableCheckbox = true
      }
      i++;
    })
    if(this.disableCheckbox) {
      this.disableButton = false
    }
  }

  public guardarDireccionSeleccionada() {
    const direccionSeleccionada: Direccion = this.direcciones[this.direccionSeleccionadaIndex]
    this.dataManagement.direccionSeleccionada.next(direccionSeleccionada)
    localStorage.setItem('direccionSeleccionada', JSON.stringify(direccionSeleccionada))
    this.disableCheckbox = true
    this.enableHora = true
  }

  addDireccion() {
    this.router.navigate(['direccion']);
  }

  public setDireccionSeleccionadaIndex(i: number) {
    if (this.direccionSeleccionadaIndex == i) {
      this.direccionSeleccionadaIndex = -1
      this.disableButton = true
    } else {
      this.direccionSeleccionadaIndex = i
      this.disableButton = false
    }
  }

}
