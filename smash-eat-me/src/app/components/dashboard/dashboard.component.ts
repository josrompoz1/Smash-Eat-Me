import { Component, OnInit } from '@angular/core';
import { Reto } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../styles.css']
})
export class DashboardComponent implements OnInit {

  progreso: number = 10;
  retos: Reto[] = []
  displayedColumns: string[] = ['nombre', 'descripcion', 'categoria', 'dificultad', 'completado', 'solucion'];

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.retos = await this.dataManagement.getAllRetos()
  }

}
