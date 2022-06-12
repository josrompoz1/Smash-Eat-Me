import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  element: boolean = true;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.element = false;
    }, 5000);
  }

}
