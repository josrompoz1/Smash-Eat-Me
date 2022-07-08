import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PedidoComida } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { ValoracionService } from 'src/app/Services/valoracion.service';
import { PedidoDialogComponent } from '../pedido-dialog/pedido-dialog.component';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css', '../styles.css']
})
export class HistorialPedidosComponent implements OnInit {

  rol: string = 'ADMIN';
  // rol: string = 'NOADMIN';
  titulo!: string;
  dataSource: PedidoComida[] = []
  displayedColumns: string[] = ['id', 'direccion', 'pago', 'fecha', 'estado', 'valorar'];
  displayedColumnsAdmin: string[] = ['id', 'usuario', 'direccion', 'fecha', 'hora', 'estado', 'gestionar'];

  constructor(private dataManagement: DataManagementService,
              private router: Router,
              private valoracionService: ValoracionService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getData();
  }

  private async getData() {
    if(this.rol === 'ADMIN') {
      this.titulo = 'Gestión de pedidos'
      this.dataSource = await this.dataManagement.getAllPedidos()
    }
    if(this.rol === 'NOADMIN') {
      this.titulo = 'Mis pedidos'
      this.dataSource = await this.dataManagement.getPedidosByUsuarioId(1);
    }
  }

  public redirectToValoracion(element: PedidoComida) {
    this.valoracionService.pedidoAValorar.next(element);
    this.router.navigate(['valoracion'])
  }

  public gestionarPedido(element: PedidoComida) {
    this.dataManagement.selectedPedido = element;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    let dialogRef = this.dialog.open(PedidoDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.getData()
    })
  }
  

}
