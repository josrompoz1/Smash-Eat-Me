import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mesa } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-historial-mesas',
  templateUrl: './historial-mesas.component.html',
  styleUrls: ['./historial-mesas.component.css', '../styles.css']
})
export class HistorialMesasComponent implements OnInit {

  rol: string = 'ADMIN';
  titulo: string = '';
  dataSource: Mesa[] = []
  displayedColumns: string[] = ['numeroPersonas', 'fecha', 'hora', 'menuId', 'eliminar'];
  displayedColumnsAdmin: string[] = ['usuarioId', 'numeroPersonas', 'fecha', 'hora', 'menuId', 'eliminar'];

  constructor(private dataManagement: DataManagementService,
              private router: Router) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    if(this.rol == 'NOADMIN') {
      this.titulo = 'Mis reservas de mesa'
      this.dataSource = await this.dataManagement.getMesaByUsuarioId(1)
    } else {
      this.titulo = 'Historial de reservas'
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

}
