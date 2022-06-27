import { Component, OnInit } from '@angular/core';
import { Tarjeta } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-add-credito',
  templateUrl: './add-credito.component.html',
  styleUrls: ['./add-credito.component.css', '../styles.css']
})
export class AddCreditoComponent implements OnInit {

  tarjetas: Tarjeta[] = [];
  tarjetaSeleccionadaIndex: number = -1;
  creditoDigital: number = 0;
  value = 0;
  creditoSeleccionado: number = 0;

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.tarjetas = await this.dataManagement.getTarjetasUsuario(1); //usuario 1 por defecto
    this.creditoDigital = await this.dataManagement.getCreditoDigital(1);
  }

  public setCreditoSeleccionado(credito: number) {
    this.creditoSeleccionado = credito;
  }

  public async anyadirCredito() {
    await this.dataManagement.addCreditoDigital(1, this.creditoSeleccionado)
    await this.getData();
  }

}
