import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-filtro-productos',
  templateUrl: './filtro-productos.component.html',
  styleUrls: ['./filtro-productos.component.css', '../styles.css']
})
export class FiltroProductosComponent implements OnInit {

  form!: FormGroup;
  paramTipo!: string;
  paramBusqueda!: string;

  constructor(private dialogRef: MatDialogRef<FiltroProductosComponent>,
              private dataManagement: DataManagementService) {
    this.dataManagement.paramTipo.subscribe(value => {
      this.paramTipo = value
    })
    this.dataManagement.paramBusqueda.subscribe(value => {
      this.paramBusqueda = value
    })
  }

  ngOnInit(): void {
    this.getData()
  }

  private getData() {
    if(this.paramTipo != '' && this.paramBusqueda != '') {
      this.form = new FormGroup({
        'tipo': new FormControl(this.paramTipo, []),
        'busqueda': new FormControl(this.paramBusqueda, [])
      })
    } else if(this.paramBusqueda != '') {
      this.form = new FormGroup({
        'tipo': new FormControl('', []),
        'busqueda': new FormControl(this.paramBusqueda, [])
      })
    } else if(this.paramTipo != '') {
      this.form = new FormGroup({
        'tipo': new FormControl(this.paramTipo, []),
        'busqueda': new FormControl('', [])
      })
    } else {
      this.form = new FormGroup({
        'tipo': new FormControl('', []),
        'busqueda': new FormControl('', [])
      })
    }
  }

  onClose() {
    this.dialogRef.close()
  }

  public updateParametros() {    
    this.dataManagement.paramTipo.next(this.form.value.tipo)
    this.dataManagement.paramBusqueda.next(this.form.value.busqueda)
    this.onClose()
  }

  public limpiarForm() {
    this.dataManagement.paramTipo.next('')
    this.dataManagement.paramBusqueda.next('')
    this.onClose()
  }

}
