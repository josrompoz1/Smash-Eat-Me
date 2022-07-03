import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoComida } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { ValoracionService } from 'src/app/Services/valoracion.service';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css', '../styles.css']
})
export class HistorialPedidosComponent implements OnInit {

  dataSource: PedidoComida[] = []
  displayedColumns: string[] = ['id', 'direccion', 'pago', 'fecha', 'estado', 'valorar'];

  constructor(private dataManagement: DataManagementService,
              private router: Router,
              private valoracionService: ValoracionService) { }

  ngOnInit(): void {
    this.getData();
  }

  private async getData() {
    this.dataSource = await this.dataManagement.getPedidosByUsuarioId(1);
  }

  public redirectToValoracion(element: PedidoComida) {
    this.valoracionService.pedidoAValorar.next(element);
    this.router.navigate(['valoracion'])
  }

}
