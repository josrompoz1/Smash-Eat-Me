import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mesa } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-historial-mesas',
  templateUrl: './historial-mesas.component.html',
  styleUrls: ['./historial-mesas.component.css', '../styles.css']
})
export class HistorialMesasComponent implements OnInit {

  titulo: string = '';
  dataSource: Mesa[] = []
  displayedColumns: string[] = ['numeroPersonas', 'fecha', 'hora', 'menuId', 'eliminar'];
  displayedColumnsAdmin: string[] = ['usuarioId', 'numeroPersonas', 'fecha', 'hora', 'menuId', 'eliminar'];
  tituloBoton!: string;

  rol: string = '';
  userId: number = 0;

  constructor(private dataManagement: DataManagementService,
              private router: Router,
              private sesionService: SesionService) {
    this.sesionService.rol.subscribe(value => {
      this.rol = value
    })
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    if(this.rol == 'NO ADMIN') {
      this.titulo = 'Mis reservas de mesa'
      this.dataSource = await this.dataManagement.getMesaByUsuarioId(this.userId)
    } else if(this.rol == 'ADMIN') {
      this.titulo = 'Historial de reservas'
      this.tituloBoton = 'Ver mis reservas'
      this.dataSource = await this.dataManagement.getAllMesas()
    }
  }

  public redirectToReservarMesa() {
    this.router.navigate(['reservamesa'])
  }

  public async deleteReserva(element: Mesa) {
    if(element.id) await this.dataManagement.deleteReserva(element.id).then(() => {
      this.getData()
    })
  }

  public async adminMisReservas() {
    this.titulo = 'Mis reservas'
    this.tituloBoton = 'Ver todas las reservas'
    this.dataSource = await this.dataManagement.getMesaByUsuarioId(this.userId)
  }

  public async adminTodasLasReservas() {
    this.titulo = 'Historial de reservas'
    this.tituloBoton = 'Ver mis reservas'
    this.dataSource = await this.dataManagement.getAllMesas()
  }

}
