import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  element: boolean = false;
  mensaje: string = '';

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.element = false;
    }, 5000);
  }

}
