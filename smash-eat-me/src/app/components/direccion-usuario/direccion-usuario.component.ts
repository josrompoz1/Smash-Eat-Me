import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccion, ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-direccion-usuario',
  templateUrl: './direccion-usuario.component.html',
  styleUrls: ['./direccion-usuario.component.css', '../styles.css']
})
export class DireccionUsuarioComponent implements OnInit {

  public direcciones: Direccion[] = [];
  direccionSeleccionadaIndex: number = -1;
  productosEnCesta: ProductoOfertado[] = [];

  constructor(private dataManagement: DataManagementService,
              private route: ActivatedRoute,
              private router: Router) {

    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosEnCesta = value;
    })
  }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.direcciones = await this.dataManagement.getDireccionesUsuario(1); //usuario 1 por defecto. cambiar cuando esté el login
  }

  public guardarDireccionSeleccionada() {
    const direccionSeleccionada: Direccion = this.direcciones[this.direccionSeleccionadaIndex]
    this.dataManagement.direccionSeleccionada.next(direccionSeleccionada)
    this.router.navigate(['horaentrega'], { relativeTo: this.route });
  }

}
