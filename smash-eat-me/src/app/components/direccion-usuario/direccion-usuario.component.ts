import { Component, OnInit } from '@angular/core';
import { Direccion } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-direccion-usuario',
  templateUrl: './direccion-usuario.component.html',
  styleUrls: ['./direccion-usuario.component.css', '../styles.css']
})
export class DireccionUsuarioComponent implements OnInit {

  public direcciones: Direccion[] = [];
  direccionSeleccionadaIndex: number = -1;
  // labelPosition: 'before' | 'after' = 'after';

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.direcciones = await this.dataManagement.getDireccionesUsuario(1); //usuario 1 por defecto. cambiar cuando esté el login
  }

  public guardarDireccionSeleccionada() {
    const direccionSeleccionada: Direccion = this.direcciones[this.direccionSeleccionadaIndex]
    this.dataManagement.direccionSeleccionada?.next(direccionSeleccionada)
  }

}
