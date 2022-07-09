import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CuponDescuento } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { CuponDescuentoDialogComponent } from '../cupon-descuento-dialog/cupon-descuento-dialog.component';

@Component({
  selector: 'app-listado-cupones-descuento',
  templateUrl: './listado-cupones-descuento.component.html',
  styleUrls: ['./listado-cupones-descuento.component.css', '../styles.css']
})
export class ListadoCuponesDescuentoComponent implements OnInit {

  cupones: CuponDescuento[] = []
  displayedColumns: string[] = ['codigo', 'porcentaje', 'editar'];

  constructor(private dataManagement: DataManagementService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.cupones = await this.dataManagement.getAllCupones()
  }

  public abrirCuponDialog(element?: CuponDescuento) {
    if(element) {
      this.dataManagement.selectedCupon = element;
    }    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = "70%";
    dialogConfig.height = "70%"
    let dialogRef = this.dialog.open(CuponDescuentoDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.dataManagement.selectedCupon = undefined;
      this.getData()
    })
  }

}
