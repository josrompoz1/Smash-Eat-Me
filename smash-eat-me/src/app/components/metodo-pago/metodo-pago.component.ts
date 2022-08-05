import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuponDescuento, Direccion, ProductoOfertado, Tarjeta } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-metodo-pago',
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.css', '../styles.css']
})
export class MetodoPagoComponent implements OnInit {

  tarjetas: Tarjeta[] = [];
  tarjetaSeleccionadaIndex: number = -1;
  tarjetaSeleccionada!: Tarjeta;
  creditoSeleccionadoIndex: number = -1;
  creditoSeleccionado!: boolean;
  productosEnCesta: ProductoOfertado[] = [];
  creditoDigital: number = 0;
  precioTotal: number = 0;
  descuentoAplicado!: CuponDescuento
  form!: FormGroup;
  userId: number = 0;
  errors: string[] = []
  direccion: Direccion = {};
  hora: string = '';
  disableTramitar: boolean = true;
  disableCredito: boolean = false;
  disableTarjeta: boolean = false;

  constructor(private dataManagement: DataManagementService,
    private router: Router,
    private sesionService: SesionService) {
    this.dataManagement.productosEnCesta.subscribe(value => {
      this.productosEnCesta = value;
    })
    this.dataManagement.precioPedido.subscribe(value => {
      this.precioTotal = value;
    })
    this.dataManagement.tarjetaSeleccionada.subscribe(value => {
      this.tarjetaSeleccionada = value;
    })
    this.dataManagement.seleccionadoCreditoDigital.subscribe(value => {
      this.creditoSeleccionado = value;
    })
    this.dataManagement.descuentoAplicado.subscribe(value => {
      this.descuentoAplicado = value;
    })
    this.dataManagement.direccionSeleccionada.subscribe(value => {
      this.direccion = value;
    })
    this.dataManagement.horaSeleccionada.subscribe(value => {
      this.hora = value;
    })
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'codigo': new FormControl('', [Validators.required])
    })
    if (this.userId > 0) {
      if (this.hora == '') {
        this.router.navigate(['cesta/direccion/horaentrega'])
      } else {
        this.getData();
      }
    } else {
      this.router.navigate(['cesta'])
    }
  }

  private async getData() {
    this.tarjetas = await this.dataManagement.getTarjetasUsuario(this.userId);
    this.creditoDigital = await this.dataManagement.getCreditoDigital(this.userId);
    if (this.creditoSeleccionado == false) {
      let i = 0;
      this.tarjetas.forEach(tarjeta => {
        if (tarjeta.id == this.tarjetaSeleccionada.id) {
          this.tarjetaSeleccionadaIndex = i
        }
        i++;
      })
    } else {
      this.creditoSeleccionadoIndex = 0
    }
    this.calculaPrecio();

  }

  public guardarTarjetaSeleccionada() {
    console.log(this.tarjetaSeleccionadaIndex)
    this.creditoSeleccionadoIndex = -1;
    this.disableTramitar = false
    this.disableCredito = true
    this.disableTarjeta = true
    this.dataManagement.seleccionadoCreditoDigital.next(false);

    const tarjetaSeleccionada: Tarjeta = this.tarjetas[this.tarjetaSeleccionadaIndex]
    this.dataManagement.tarjetaSeleccionada.next(tarjetaSeleccionada)
    localStorage.setItem('tarjetaSeleccionada', JSON.stringify(tarjetaSeleccionada))
    localStorage.setItem('seleccionadoCreditoDigital', JSON.stringify(false))
  }

  public guardarCarteraDigital() {
    this.tarjetaSeleccionadaIndex = -1;
    this.disableTramitar = false
    this.disableCredito = true
    this.disableTarjeta = true
    this.dataManagement.seleccionadoCreditoDigital.next(true);
    localStorage.setItem('seleccionadoCreditoDigital', JSON.stringify(true))
    localStorage.setItem('tarjetaSeleccionada', JSON.stringify({}))
  }

  public async aplicarCuponDescuento() {
    if (this.form.valid) {
      const cupon: CuponDescuento[] = await this.dataManagement.getCuponDescuentoByCodigo(this.form.value.codigo);
      if (cupon != undefined) {
        this.dataManagement.descuentoAplicado.next(cupon[0])
        localStorage.setItem('descuentoAplicado', JSON.stringify(cupon[0]))
        if (cupon[0].porcentaje != undefined)
          this.precioTotal = (this.precioTotal * (100 - cupon[0].porcentaje)) / 100
        this.dataManagement.precioPedido.next(this.precioTotal)
        this.form.controls['codigo'].disable();
      }
    }
  }

  public tramitarPedido() {
    if(this.userId > 0 && (this.creditoSeleccionadoIndex > -1 || this.tarjetaSeleccionadaIndex > -1)) {
      if (this.creditoSeleccionado && this.precioTotal > this.creditoDigital) {
        this.errors.push('El credito digital es menor al precio del pedido')
      } else {
        this.errors.length = 0
        this.router.navigate(['pedido']);
      }
    }
  }

  private calculaPrecio() {
    this.precioTotal = 0;
    for (let key of this.dataManagement.productosEnCesta.getValue()) {
      this.precioTotal += key.precio;
    }
    this.dataManagement.precioPedido.next(this.precioTotal)
  }

}
