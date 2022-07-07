import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PedidoComida } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-pedido-dialog',
  templateUrl: './pedido-dialog.component.html',
  styleUrls: ['./pedido-dialog.component.css', '../styles.css']
})
export class PedidoDialogComponent implements OnInit {

  pedido!: PedidoComida;
  
  constructor(private dataManagement: DataManagementService,
              private dialogRef: MatDialogRef<PedidoDialogComponent>) { }

  ngOnInit(): void {
    if(this.dataManagement.selectedPedido) this.pedido = this.dataManagement.selectedPedido;
  }

  onClose() {
    this.dialogRef.close()
  }

}
