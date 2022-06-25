import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CuponDescuento, ProductoOfertado, Tarjeta } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-metodo-pago',
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.css', '../styles.css']
})
export class MetodoPagoComponent implements OnInit {

  tarjetas: Tarjeta[] = [];
  tarjetaSeleccionadaIndex: number = -1;
  creditoSeleccionadoIndex: number = -1;
  productosEnCesta: ProductoOfertado[] = [];
  creditoDigital: number = 0;
  precioTotal: number = 0;
  form!: FormGroup;

  constructor(private dataManagement: DataManagementService) {
    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosEnCesta = value;
    })
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'codigo': new FormControl('', [Validators.required])
    })
    this.getData();
  }

  private async getData() {
    this.tarjetas = await this.dataManagement.getTarjetasUsuario(1); //usuario 1 por defecto
    this.creditoDigital = await this.dataManagement.getCreditoDigital(1);
    this.calculaPrecio();
  }

  public guardarTarjetaSeleccionada() {
    this.creditoSeleccionadoIndex = -1;
    this.dataManagement.seleccionadoCreditoDigital.next(false);

    const tarjetaSeleccionada: Tarjeta = this.tarjetas[this.tarjetaSeleccionadaIndex]
    this.dataManagement.tarjetaSeleccionada?.next(tarjetaSeleccionada)
  }

  public guardarCarteraDigital() {
    this.tarjetaSeleccionadaIndex = -1;
    
    this.dataManagement.seleccionadoCreditoDigital.next(true);
  }

  public async aplicarCuponDescuento() {
    if(this.form.valid) {
      const cupon: CuponDescuento[] = await this.dataManagement.getCuponDescuentoByCodigo(this.form.value.codigo);
      if(cupon != undefined) {
        this.precioTotal = (this.precioTotal * (100 - cupon[0].porcentaje)) / 100
        this.form.controls['codigo'].disable();
      }
    }
  }

  private calculaPrecio() {
    this.precioTotal = 0;
    for (let key of this.dataManagement.productosEnCesta.getValue()) {
      this.precioTotal += key.precio;
    }
    console.log(this.precioTotal)
  }

}
