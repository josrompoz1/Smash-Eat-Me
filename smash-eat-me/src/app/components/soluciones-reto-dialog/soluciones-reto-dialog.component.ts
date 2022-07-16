import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Paso, Reto, Solucion } from 'src/app/Models/types';
import { RetosService } from 'src/app/Services/retos.service';

@Component({
  selector: 'app-soluciones-reto-dialog',
  templateUrl: './soluciones-reto-dialog.component.html',
  styleUrls: ['./soluciones-reto-dialog.component.css', '../styles.css']
})
export class SolucionesRetoDialogComponent implements OnInit {

  soluciones: Solucion[] = [];
  pasos: Paso[] = []
  reto!: Reto;
  retoId!: number;

  constructor(private dialogRef: MatDialogRef<SolucionesRetoDialogComponent>,
              private retosService: RetosService) {
    this.retosService.retoIdSeleccionado.subscribe(value => {
      this.retoId = value;
    })
  }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.reto = await this.retosService.getRetoById(this.retoId)
    this.soluciones = await this.retosService.getSolucionesByRetoId(this.retoId)
    
    this.soluciones.forEach(async (solucion) => {
      const pasosSolucion: Paso[] = await this.retosService.getPasosBySolucionId(solucion.id);
      pasosSolucion.forEach(paso => {
        this.pasos.push(paso);
      });
    })
  }

  onClose() {
    this.dialogRef.close()
  }

}
