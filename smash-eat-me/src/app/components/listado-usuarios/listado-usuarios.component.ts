import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  displayedColumnsUsuario: string[] = ['username', 'correo', 'rol', 'perfil', 'eliminar'];
  displayedColumnsValoracion: string[] = ['usuario', 'producto', 'puntuacion'];

  constructor(private dataManagement: DataManagementService, private router: Router) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.usuarios = await this.dataManagement.getAllUsuarios()
    this.valoraciones = await this.dataManagement.getAllValoraciones()
  }

  public redirectToPerfilUsuario(id: number) {
    this.dataManagement.selectedUsuarioId = id
    this.router.navigate(['usuario'])
  }

  public async deleteUsuario(id: number) {
    await this.dataManagement.deleteUsuario(id).then(() => {
      this.getData()
    })
  }

}
