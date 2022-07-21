import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PedidoComida } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';
import { ValoracionService } from 'src/app/Services/valoracion.service';
import { PedidoDialogComponent } from '../pedido-dialog/pedido-dialog.component';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css', '../styles.css']
})
export class HistorialPedidosComponent implements OnInit {

  titulo!: string;
  dataSource: PedidoComida[] = []
  displayedColumns: string[] = ['id', 'direccion', 'pago', 'fecha', 'estado', 'valorar'];
  displayedColumnsAdmin: string[] = ['id', 'usuario', 'direccion', 'fecha', 'hora', 'estado', 'gestionar'];
  tituloBoton!: string;

  rol: string = '';
  userId: number = 0;

  constructor(private dataManagement: DataManagementService,
              private router: Router,
              private valoracionService: ValoracionService,
              private dialog: MatDialog,
              private sesionService: SesionService) {
    this.sesionService.rol.subscribe(value => {
      this.rol = value
    })
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    this.getData();
  }

  private async getData() {
    if(this.rol === 'ADMIN') {
      this.titulo = 'Gestión de pedidos'
      this.tituloBoton = 'Ver mis pedidos'
      this.dataSource = await this.dataManagement.getAllPedidos()
    }
    if(this.rol === 'NO ADMIN') {
      this.titulo = 'Mis pedidos'
      this.dataSource = await this.dataManagement.getPedidosByUsuarioId(this.userId);
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
    dialogConfig.width = "80%";
    dialogConfig.height = "80%"
    let dialogRef = this.dialog.open(PedidoDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.getData()
    })
  }
  
  public async adminMisPedidos() {
    this.titulo = 'Mis pedidos'
    this.tituloBoton = 'Ver todos los pedidos'
    this.dataSource = await this.dataManagement.getPedidosByUsuarioId(this.userId)
  }

  public async adminTodosPedidos() {
    this.titulo = 'Gestión de pedidos'
    this.tituloBoton = 'Ver mis pedidos'
    this.dataSource = await this.dataManagement.getAllPedidos()
  }

}
