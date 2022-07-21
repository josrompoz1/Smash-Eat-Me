import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  userId: number = 0;

  constructor(private dataManagement: DataManagementService, private sesionService: SesionService) {
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
    if(this.form.valid) {
      const tarjeta: Tarjeta = {
        numero: this.form.value.numero,
        expiracion: this.form.value.expiracion,
        usuarioId: this.userId
      }
      await this.dataManagement.crearTarjeta(tarjeta)
    }
  }

}
