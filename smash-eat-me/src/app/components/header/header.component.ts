import { Component, OnInit } from '@angular/core';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public numberOfItems: number | undefined;
  rol: string = 'ADMIN';

  constructor(private dataManagement: DataManagementService) {
    this.dataManagement.numberOfItemsInBasket.subscribe(value => {
      this.numberOfItems = value;
    })
  }

  ngOnInit(): void {
  }

}
