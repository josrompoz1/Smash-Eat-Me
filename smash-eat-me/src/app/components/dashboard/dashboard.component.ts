import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Reto } from 'src/app/Models/types';
import { RetosService } from 'src/app/Services/retos.service';
import { DashboardDialogComponent } from '../dashboard-dialog/dashboard-dialog.component';
import { SolucionesRetoDialogComponent } from '../soluciones-reto-dialog/soluciones-reto-dialog.component';

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

  constructor(private retosService: RetosService,
              private dialog: MatDialog) {
    this.retosService.paramDificultad.subscribe(value => {
      this.paramDificultad = value
    })
    this.retosService.paramCategoria.subscribe(value => {
      this.paramCategoria = value
    })
  }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.retos = await this.retosService.getAllRetos()
    const nRetos: number = await this.retosService.countAllRetos()
    const nRetosCompletados: number = await this.retosService.countRetosCompletados()
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
      this.retos = await this.retosService.getRetosFilterByCategoriaAndDificultad(this.paramCategoria, minimo, maximo)
    } else if(this.paramCategoria != '') {
      this.hidden = false;
      this.numberOfFilters = 1;
      this.retos = await this.retosService.getRetosFilterByCategoria(this.paramCategoria)
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
      this.retos = await this.retosService.getRetosFilterByDificultad(minimo, maximo)

    } else {
      this.hidden = true;
      this.numberOfFilters = 0;
      this.getData()
    }
  }

  public solucionDialog(element: Reto) {
    if(element.id != undefined) {
      this.retosService.retoIdSeleccionado.next(element.id)
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = "95%";
      dialogConfig.height = "95%"
      this.dialog.open(SolucionesRetoDialogComponent, dialogConfig);
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
