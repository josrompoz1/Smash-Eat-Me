import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css', '../styles.css']
})
export class RegistroUsuarioComponent implements OnInit {

  form!: FormGroup;
  errors: string[] = [];
  
  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'nombre': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'correo': new FormControl('', [Validators.required, Validators.email]),
      'contrasena': new FormControl('', [Validators.required]),
      'telefono': new FormControl(null, [])
    })
  }

  public async crearUsuario() {
    if(this.form.valid) {
      await this.dataManagement.crearUsuario(this.form.value);
    }
  }

}
