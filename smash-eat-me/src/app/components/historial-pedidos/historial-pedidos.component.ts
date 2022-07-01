import { Component, OnInit } from '@angular/core';
import { Direccion, PedidoComida } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css', '../styles.css']
})
export class HistorialPedidosComponent implements OnInit {

  dataSource: PedidoComida[] = []
  displayedColumns: string[] = ['id', 'direccion', 'pago', 'fecha', 'estado', 'valorar'];

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.getData();
  }

  private async getData() {
    this.dataSource = await this.dataManagement.getPedidosByUsuarioId(1);
  }

}
