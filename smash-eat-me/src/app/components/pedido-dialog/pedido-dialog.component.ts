import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PedidoComida, ProductoOfertado, ProductoPedido, Usuario } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-pedido-dialog',
  templateUrl: './pedido-dialog.component.html',
  styleUrls: ['./pedido-dialog.component.css', '../styles.css']
})
export class PedidoDialogComponent implements OnInit {

  pedido!: PedidoComida;
  productosPedidos: ProductoPedido[] = []
  productosEnPedido: ProductoOfertado[] = []
  cliente: Usuario[] = [];
  form!: FormGroup;
  
  constructor(private dataManagement: DataManagementService,
              private dialogRef: MatDialogRef<PedidoDialogComponent>) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'direccion': new FormControl('', []),
      'fecha': new FormControl('', []),
      'hora': new FormControl('', []),
      'estado': new FormControl('', [Validators.required]),
      'nombreCliente': new FormControl('', [])
    })
    this.getData()
  }

  private async getData() {
    if(this.dataManagement.selectedPedido) this.pedido = this.dataManagement.selectedPedido;
    if(this.pedido.id && this.pedido.usuarioId) {
      this.productosPedidos = await this.dataManagement.getProductosEnPedidoById(this.pedido.id)
      this.cliente = await this.dataManagement.getUsuarioById(this.pedido.usuarioId)
      this.form.setValue({
        'direccion': this.pedido.nombreDireccion,
        'fecha': this.pedido.fecha,
        'hora': this.pedido.hora,
        'estado': this.pedido.estado,
        'nombreCliente': this.cliente[0].nombre
      })
      console.log(this.form.value)
    }
    if(this.productosPedidos.length > 0) {
      this.productosPedidos.forEach(async p => {
        const productoOfertado = await this.dataManagement.getProductosById(p.productoOfertadoId)
        if(productoOfertado) this.productosEnPedido.push(productoOfertado)
      })
    }
    console.log(this.cliente)
    console.log(this.pedido)
    
  }

  onClose() {
    this.dialogRef.close()
  }

  public async updateEstadoPedido() {
    if(this.form.valid) {
      const estado = this.form.value.estado
      switch(estado) {
        case 'En preparacion': {
          if(this.pedido.id) await this.dataManagement.putPedidoEnPreparacion(this.pedido.id)
          break;
        }
        case 'En transito': {
          if(this.pedido.id) await this.dataManagement.putPedidoEnTransito(this.pedido.id)
          break;
        }
        case 'Entregado': {
          if(this.pedido.id) await this.dataManagement.putPedidoEntregado(this.pedido.id)
          break;
        }
      }
    }
  }

}
