import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Menu } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-reservar-mesa',
  templateUrl: './reservar-mesa.component.html',
  styleUrls: ['./reservar-mesa.component.css', '../styles.css']
})
export class ReservarMesaComponent implements OnInit {

  menus: Menu[] = []
  form!: FormGroup;
  formDescuento!: FormGroup;
  menuSeleccionadoIndex: number = 0;

  constructor(private dataManagement: DataManagementService) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.menus = await this.dataManagement.getMenus();
    this.form = new FormGroup({
      'nombre_apellido': new FormControl('', [Validators.required]),
      'correo': new FormControl('', [Validators.required]),
      'telefono': new FormControl('', [Validators.required]),
      'fecha': new FormControl('', [Validators.required]),
      'hora': new FormControl('', [Validators.required]),
      'nPersonas': new FormControl('', [Validators.required])
    })
    this.formDescuento = new FormGroup({
      'codigo': new FormControl('', [Validators.required])
    })
  }

  public reservarMesa() {
    
  }

  public setMenuSeleccionado(i: number) {
    this.menuSeleccionadoIndex = i;
    console.log(this.menuSeleccionadoIndex)
  }

  public aplicarDescuento() {
    
  }

}
