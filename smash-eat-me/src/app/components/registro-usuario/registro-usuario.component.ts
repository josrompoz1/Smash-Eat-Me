import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css', '../styles.css']
})
export class RegistroUsuarioComponent implements OnInit {

  form!: FormGroup;
  errors: string[] = [];
  
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'nombre': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'correo': new FormControl('', [Validators.required, Validators.email]),
      'contrasena': new FormControl('', [Validators.required]),
      'telefono': new FormControl(null, [])
    })
  }

  crearUsuario() {
    console.log(this.form.valid)
    if(this.form.valid) {
      this.usuarioService.crearUsuario(this.form.value);
    }
  }

}
