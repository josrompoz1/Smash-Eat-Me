import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccion, ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-hora-entrega',
  templateUrl: './hora-entrega.component.html',
  styleUrls: ['./hora-entrega.component.css', '../styles.css']
})
export class HoraEntregaComponent implements OnInit {

  public horas: string[] = [];
  horaSeleccionadaIndex: number = -1;
  horaEntrega!: string;
  productosEnCesta: ProductoOfertado[] = [];
  disableButton: boolean = true;
  disableCheckbox = false;
  userId: number = 0;
  enablePago: boolean = false

  constructor(private dataManagement: DataManagementService,
    private router: Router,
    private sesionService: SesionService) {

    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosEnCesta = value;
    })
    this.dataManagement.horaSeleccionada.subscribe(value => {
      this.horaEntrega = value;
    })
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    if(this.userId > 0) {
      this.getData()
    } else {
      this.router.navigate(['cesta'])
    }
  }

  private getData() {
    var horaActual: string = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false })
    var hora: number = +horaActual;
    for (let i = 1; i < 5; i++) {
      this.horas.push(hora + i + ':00')
      this.horas.push(hora + i + ':30')
    }
    let i = 0;
    this.horas.forEach(h => {
      if (h == this.horaEntrega) {
        this.horaSeleccionadaIndex = i
        this.disableCheckbox = true
      }
      i++;
    })
    if(this.disableCheckbox) {
      this.disableButton = false
    }
  }

  public guardarHoraSeleccionada() {
    if(this.horaSeleccionadaIndex > -1) {
      const horaSeleccionada: string = this.horas[this.horaSeleccionadaIndex]
      this.dataManagement.horaSeleccionada.next(horaSeleccionada)
      localStorage.setItem('horaSeleccionada', horaSeleccionada)
      this.disableCheckbox = true
      this.enablePago = true
    }
  }

  public setHoraSeleccionadaIndex(i: number) {
    if (this.horaSeleccionadaIndex == i) {
      this.horaSeleccionadaIndex = -1
      this.disableButton = true
    } else {
      this.horaSeleccionadaIndex = i
      this.disableButton = false
    }
  }

}