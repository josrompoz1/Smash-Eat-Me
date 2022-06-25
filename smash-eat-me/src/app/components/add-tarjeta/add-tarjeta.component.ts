import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-add-tarjeta',
  templateUrl: './add-tarjeta.component.html',
  styleUrls: ['./add-tarjeta.component.css', '../styles.css']
})
export class AddTarjetaComponent implements OnInit {

  form!: FormGroup;
  errors: string[] = [];

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'numero': new FormControl('', [Validators.required]),
      'expiracion': new FormControl('', [Validators.required]),
      'usuarioId': new FormControl(1, []) //usuario con id 1 por defecto. cambiar cuando se implemente el login
    })
  }

  public async crearTarjeta() {
    if(this.form.valid) {
      await this.dataManagement.crearTarjeta(this.form.value)
    }
  }

}
