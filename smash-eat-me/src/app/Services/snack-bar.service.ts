import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paso, Pista } from '../Models/types';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  timeOut = 10000

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(pasos: Paso[], action: string) {
    if (pasos.length > 1) {
      pasos.forEach((paso, index) => {
        setTimeout(() => {
          this.snackBar.open(paso.solucion, action, {
            duration: this.timeOut,
            verticalPosition: 'bottom',
            horizontalPosition: 'end',

          });
        }, index * (this.timeOut + 500));

      });
    } else {
      this.snackBar.open(pasos[0].solucion, action, {
        duration: this.timeOut,
        verticalPosition: 'bottom',
        horizontalPosition: 'end'
      });
    }
  }

  openSnackBarPista(pista: Pista, action: string) {
    this.snackBar.open(pista.pista, action, {
      duration: this.timeOut
    });
  }

}
