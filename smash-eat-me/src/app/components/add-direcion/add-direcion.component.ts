import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Direccion } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { SesionService } from 'src/app/Services/sesion.service';

@Component({
  selector: 'app-add-direcion',
  templateUrl: './add-direcion.component.html',
  styleUrls: ['./add-direcion.component.css', '../styles.css']
})
export class AddDirecionComponent implements OnInit {

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
      'nombreDireccion': new FormControl('', [Validators.required]),
      'direccion': new FormControl('', [Validators.required]),
      'pais': new FormControl('', [Validators.required]),
      'ciudad': new FormControl('', [Validators.required]),
      'usuarioId': new FormControl('', [])
    })
  }

  public async crearDireccion() {
    if(this.userId > 0) {
      if(this.form.valid) {
        const direccion: Direccion = {
          nombreDireccion: this.form.value.nombreDireccion,
          direccion: this.form.value.direccion,
          pais: this.form.value.pais,
          ciudad: this.form.value.ciudad,
          usuarioId: +this.userId
        }
        await this.dataManagement.crearDireccion(direccion)
      } else {
        this.errors.length = 0
        for(let x in this.form.controls) {
          if(this.form.controls[x].getError('required') != undefined) {
            this.errors.push('El campo ' + x + ' es necesario')
          }
        }
      }
    }
  }

}
