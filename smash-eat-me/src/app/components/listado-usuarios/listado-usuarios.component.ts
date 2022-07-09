import { Component, OnInit } from '@angular/core';
import { Usuario, Valoracion } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css', '../styles.css']
})
export class ListadoUsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  valoraciones: Valoracion[] = [];

  displayedColumnsUsuario: string[] = ['username', 'correo', 'rol'];
  displayedColumnsValoracion: string[] = ['usuario', 'producto', 'puntuacion'];

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.usuarios = await this.dataManagement.getAllUsuarios()
    this.valoraciones = await this.dataManagement.getAllValoraciones()
  }

}
