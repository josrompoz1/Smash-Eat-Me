import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, Valoracion } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css', '../styles.css']
})
export class ListadoUsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  valoraciones: Valoracion[] = [];
  userId: number = 0
  rol: string = ''

  displayedColumnsUsuario: string[] = ['username', 'correo', 'rol', 'perfil', 'eliminar'];
  displayedColumnsValoracion: string[] = ['usuario', 'producto', 'puntuacion', 'eliminar'];

  constructor(private dataManagement: DataManagementService,
                private router: Router,
                private sessionService: SesionService) {
    this.sessionService.userId.subscribe(value => {
      this.userId = value
    })
    this.sessionService.rol.subscribe(value => {
      this.rol = value
    })
  }

  ngOnInit(): void {
    if(this.rol === 'ADMIN') {
      this.getData()
    } else {
      this.router.navigate([''])
    }
    
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

  public async deleteValoracion(id: number) {
    await this.dataManagement.deleteValoracion(id).then(() => {
      this.getData()
    })
  }

}
