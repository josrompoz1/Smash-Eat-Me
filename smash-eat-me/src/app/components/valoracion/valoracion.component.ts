import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PedidoComida, ProductoPedido, ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { ValoracionService } from 'src/app/Services/valoracion.service';
import { ValoracionDialogComponent } from '../valoracion-dialog/valoracion-dialog.component';

@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.component.html',
  styleUrls: ['./valoracion.component.css', '../styles.css']
})
export class ValoracionComponent implements OnInit {

  pedidoAvalorar!: PedidoComida;
  pedidoAValorarArray: PedidoComida[] = [];
  productosPedidos: ProductoPedido[] = [];
  productosAValorar: ProductoOfertado[] = [];
  value = 0;
  form!: FormGroup;
  displayedColumns: string[] = ['id', 'direccion', 'pago', 'fecha', 'estado'];
  displayedColumnsValoracion: string[] = ['nombre', 'precio', 'tipo', 'valorar'];

  constructor(private dataManagement: DataManagementService,
              private valoracionService: ValoracionService,
              private dialog: MatDialog) {
    this.valoracionService.pedidoAValorar.subscribe(value => {
      this.pedidoAvalorar = value;
    })
  }

  async ngOnInit() {
    this.getData()
  }

  public async onSelect(producto: ProductoOfertado): Promise<void> {
    this.dataManagement.selectedProducto = producto;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = "70%";
    dialogConfig.height = "80%";
    this.dialog.open(ValoracionDialogComponent, dialogConfig);
  }

  private async getData() {
    this.form = new FormGroup({
      'descripcion': new FormControl('', [])
    })
    this.pedidoAValorarArray.push(this.pedidoAvalorar)
    if(this.pedidoAValorarArray.length > 0) {
      if(this.pedidoAvalorar.id != undefined) {
        this.productosPedidos = await this.dataManagement.getProductosEnPedidoById(this.pedidoAvalorar.id);
      }
    }
    let auxArray: ProductoOfertado[] = [];
    if(this.productosPedidos.length > 0) {
      for(let productoPedido of this.productosPedidos) {
        const producto: ProductoOfertado = await this.dataManagement.getProductosById(productoPedido.productoOfertadoId)
        auxArray.push(producto)
      }
    }
    this.productosAValorar = auxArray;
  }

}
