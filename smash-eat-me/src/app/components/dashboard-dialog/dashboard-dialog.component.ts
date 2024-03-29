import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RetosService } from 'src/app/Services/retos.service';

@Component({
  selector: 'app-dashboard-dialog',
  templateUrl: './dashboard-dialog.component.html',
  styleUrls: ['./dashboard-dialog.component.css', '../styles.css']
})
export class DashboardDialogComponent implements OnInit {

  form!: FormGroup;
  paramDificultad!: string;
  paramCategoria!: string;

  constructor(private dialogRef: MatDialogRef<DashboardDialogComponent>,
              private retosService: RetosService) {
    this.retosService.paramDificultad.subscribe(value => {
      this.paramDificultad = value
    })
    this.retosService.paramCategoria.subscribe(value => {
      this.paramCategoria = value
    })
  }

  ngOnInit(): void {
    this.getData()
  }

  private getData() {
    if(this.paramCategoria != '' && this.paramDificultad != '') {
      this.form = new FormGroup({
        'dificultad': new FormControl(this.paramDificultad, []),
        'categoria': new FormControl(this.paramCategoria, [])
      })
    } else if(this.paramCategoria != '') {
      this.form = new FormGroup({
        'dificultad': new FormControl('', []),
        'categoria': new FormControl(this.paramCategoria, [])
      })
    } else if(this.paramDificultad != '') {
      this.form = new FormGroup({
        'dificultad': new FormControl(this.paramDificultad, []),
        'categoria': new FormControl('', [])
      })
    } else {
      this.form = new FormGroup({
        'dificultad': new FormControl('', []),
        'categoria': new FormControl('', [])
      })
    }
  }

  onClose() {
    this.dialogRef.close()
  }

  public updateParametros() {    
    this.retosService.paramDificultad.next(this.form.value.dificultad)
    this.retosService.paramCategoria.next(this.form.value.categoria)
    this.onClose()
  }

  public limpiarForm() {
    this.retosService.paramDificultad.next('')
    this.retosService.paramCategoria.next('')
    this.onClose()
  }

}
