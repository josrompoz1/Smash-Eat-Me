import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

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

  constructor(private dataManagement: DataManagementService,
              private route: ActivatedRoute,
              private router: Router) {

    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosEnCesta = value;
    })
    this.dataManagement.horaSeleccionada.subscribe(value => {
      this.horaEntrega = value;
    })
  }

  ngOnInit(): void {
    var horaActual: string = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false })
    var hora: number = +horaActual;
    for (let i = 1; i < 5; i++) {
      this.horas.push(hora+i+':00')
      this.horas.push(hora+i+':30')
    }
    let i = 0;
    this.horas.forEach(h => {
      if(h == this.horaEntrega) {
        this.horaSeleccionadaIndex = i
      }
      i++;
    })
  }

  public guardarHoraSeleccionada() {
    const horaSeleccionada: string = this.horas[this.horaSeleccionadaIndex]
    this.dataManagement.horaSeleccionada.next(horaSeleccionada)
    localStorage.setItem('horaSeleccionada', horaSeleccionada)
    this.router.navigate(['metodopago'], { relativeTo: this.route })
  }

}