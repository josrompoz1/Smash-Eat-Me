import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Reto } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { DashboardDialogComponent } from '../dashboard-dialog/dashboard-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../styles.css']
})
export class DashboardComponent implements OnInit {

  progreso: number = 0;
  retos: Reto[] = []
  displayedColumns: string[] = ['nombre', 'descripcion', 'categoria', 'dificultad', 'completado', 'solucion'];
  numberOfFilters: number = 0;
  hidden: boolean = true;

  paramDificultad!: string;
  paramCategoria!: string;

  constructor(private dataManagement: DataManagementService,
              private dialog: MatDialog) {
    this.dataManagement.paramDificultad.subscribe(value => {
      this.paramDificultad = value
    })
    this.dataManagement.paramCategoria.subscribe(value => {
      this.paramCategoria = value
    })
  }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.retos = await this.dataManagement.getAllRetos()
    const nRetos: number = await this.dataManagement.countAllRetos()
    const nRetosCompletados: number = await this.dataManagement.countRetosCompletados()
    this.progreso = (nRetosCompletados/nRetos)*100
  }

  public filterDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.height = "70%"
    let dialogRef = this.dialog.open(DashboardDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.filterData()
    })
  }

  private async filterData() {
    if(this.paramCategoria != '' && this.paramDificultad != '') {
      this.hidden = false;
      this.numberOfFilters = 2;
      let minimo: number;
      let maximo: number;
      switch (this.paramDificultad) {
        case 'Principiante': {
          minimo = 1;
          maximo = 2;
          break;
        }
        case 'Intermedio': {
          minimo = 3;
          maximo = 4;
          break;
        }
        case 'Avanzado': {
          minimo = 5;
          maximo = 5;
          break;
        }
        default: {
          minimo = 1;
          maximo = 5;
          break;
        }     
      }
      this.retos = await this.dataManagement.getRetosFilterByCategoriaAndDificultad(this.paramCategoria, minimo, maximo)
    } else if(this.paramCategoria != '') {
      this.hidden = false;
      this.numberOfFilters = 1;
      this.retos = await this.dataManagement.getRetosFilterByCategoria(this.paramCategoria)
    } else if(this.paramDificultad != '') {
      this.hidden = false;
      this.numberOfFilters = 1;
      let minimo: number;
      let maximo: number;
      switch (this.paramDificultad) {
        case 'Principiante': {
          minimo = 1;
          maximo = 2;
          break;
        }
        case 'Intermedio': {
          minimo = 3;
          maximo = 4;
          break;
        }
        case 'Avanzado': {
          minimo = 5;
          maximo = 5;
          break;
        }
        default: {
          minimo = 1;
          maximo = 5;
          break;
        }     
      }
      this.retos = await this.dataManagement.getRetosFilterByDificultad(minimo, maximo)

    } else {
      this.hidden = true;
      this.numberOfFilters = 0;
      this.getData()
    }
  }

  public downloadProgress() {
    console.log("DOWNLOAD")
    //funcionalidad para descargar un json con los datos de progreso
  }

  public uploadProgress() {
    console.log("UPLOAD")
    //funcionalidad para importar un json con los datos de progreso
  }

}
