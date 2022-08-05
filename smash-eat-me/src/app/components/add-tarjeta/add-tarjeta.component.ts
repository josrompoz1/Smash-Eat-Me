import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tarjeta } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-add-tarjeta',
  templateUrl: './add-tarjeta.component.html',
  styleUrls: ['./add-tarjeta.component.css', '../styles.css']
})
export class AddTarjetaComponent implements OnInit {

  form!: FormGroup;
  errors: string[] = [];
  value: string = "";

  userId: number = 0;

  constructor(private dataManagement: DataManagementService, private sesionService: SesionService, private router: Router) {
    this.sesionService.userId.subscribe(value => {
      this.userId = value
    })
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'numero': new FormControl('', [Validators.required, Validators.maxLength(20)]),
      'expiracion': new FormControl('', [Validators.required]),
      'usuarioId': new FormControl('', [])
    })
  }

  public async crearTarjeta() {
    if(this.userId > 0) {
      this.checkFecha(this.form.value.expiracion)
      if(this.form.valid) {
        this.errors.length = 0
        const tarjeta: Tarjeta = {
          numero: this.form.value.numero,
          expiracion: this.form.value.expiracion,
          usuarioId: this.userId
        }
        await this.dataManagement.crearTarjeta(tarjeta).then(() => this.router.navigate(['usuario']))
      } else {
        this.errors.length = 0
        for(let x in this.form.controls) {
          if(this.form.controls[x].getError('required') != undefined) {
            this.errors.push('El campo ' + x + ' es necesario')
          } else if(this.form.controls[x].getError('maxlength') != undefined) {
            this.errors.push('El número tiene como máximo 20 dígitos')
          } else if(this.form.controls[x].getError('posterior') != undefined) {
            this.errors.push('La tarjeta está caducada')
          }
        }
      }
    }
  }

  private checkFecha(fechaString: string) {
    if(fechaString !== '') {
      const fecha = new Date(fechaString)
      const c: boolean = fecha <= new Date()
      if(c) {
        this.form.get('expiracion')?.setErrors({ 'posterior': c })
      }
    }
  }

}
