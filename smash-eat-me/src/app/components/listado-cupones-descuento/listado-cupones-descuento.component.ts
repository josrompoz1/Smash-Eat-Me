import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CuponDescuento } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';
import { CuponDescuentoDialogComponent } from '../cupon-descuento-dialog/cupon-descuento-dialog.component';

@Component({
  selector: 'app-listado-cupones-descuento',
  templateUrl: './listado-cupones-descuento.component.html',
  styleUrls: ['./listado-cupones-descuento.component.css', '../styles.css']
})
export class ListadoCuponesDescuentoComponent implements OnInit {

  cupones: CuponDescuento[] = []
  displayedColumns: string[] = ['codigo', 'porcentaje', 'editar', 'eliminar'];
  rol: string = ''
  userId: number = 0

  constructor(private dataManagement: DataManagementService,
              private dialog: MatDialog,
              private sesionService: SesionService,
              private router: Router) {
    this.sesionService.rol.subscribe(value => {
      this.rol = value
    })
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    if(this.userId > 0 && this.rol == 'ADMIN') {
      this.getData()
    } else {
      this.router.navigate([''])
    }
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
    dialogConfig.height = "80%"
    let dialogRef = this.dialog.open(CuponDescuentoDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.dataManagement.selectedCupon = undefined;
      this.getData()
    })
  }

  public async deleteCupon(element: CuponDescuento) {
    if(element.id) await this.dataManagement.deleteCupon(element.id).then(() => {
      this.getData()
    })
  }

}
