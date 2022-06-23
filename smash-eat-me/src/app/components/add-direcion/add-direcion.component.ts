import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-add-direcion',
  templateUrl: './add-direcion.component.html',
  styleUrls: ['./add-direcion.component.css', '../styles.css']
})
export class AddDirecionComponent implements OnInit {

  form!: FormGroup;
  errors: string[] = [];

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'nombreDireccion': new FormControl('', [Validators.required]),
      'direccion': new FormControl('', [Validators.required]),
      'pais': new FormControl('', [Validators.required]),
      'ciudad': new FormControl('', [Validators.required]),
      'usuarioId': new FormControl(1, []) //usuario con id 1 por defecto. cambiar cuando se implemente el login
    })
  }

  public async crearDireccion() {
    if(this.form.valid) {
      await this.dataManagement.crearDireccion(this.form.value)
    }
  }

}
