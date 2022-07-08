import { Component, OnInit } from '@angular/core';
import { CuponDescuento } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-listado-cupones-descuento',
  templateUrl: './listado-cupones-descuento.component.html',
  styleUrls: ['./listado-cupones-descuento.component.css', '../styles.css']
})
export class ListadoCuponesDescuentoComponent implements OnInit {

  cupones: CuponDescuento[] = []
  displayedColumns: string[] = ['codigo', 'porcentaje', 'editar'];

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.cupones = await this.dataManagement.getAllCupones()
  }

}
