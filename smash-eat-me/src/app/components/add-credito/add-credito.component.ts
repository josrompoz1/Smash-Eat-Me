import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Tarjeta } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

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
  userId: number = 0

  constructor(private dataManagement: DataManagementService, private sesionService: SesionService, private toastr: ToastrService) {
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.tarjetas = await this.dataManagement.getTarjetasUsuario(this.userId);
    this.creditoDigital = await this.dataManagement.getCreditoDigital(this.userId);
  }

  public setCreditoSeleccionado(credito: number) {
    this.creditoSeleccionado = credito;
  }

  public async anyadirCredito() {
    const creditoTotal = this.creditoDigital + this.creditoSeleccionado
    if(creditoTotal > 1000) {
      this.toastr.error('El credito digital no puede ser superior a 1000')
    } else {
      await this.dataManagement.addCreditoDigital(this.userId, this.creditoSeleccionado)
      await this.getData();
    }
    
  }

}
