import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Menu, ProductoOfertado } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-detalles-menu-dialog',
  templateUrl: './detalles-menu-dialog.component.html',
  styleUrls: ['./detalles-menu-dialog.component.css', '../styles.css']
})
export class DetallesMenuDialogComponent implements OnInit {

  titulo: string = ''
  menu!: Menu;
  dataSource: Menu[] = []
  displayedColumns: string[] = ['nombre', 'descripcion', 'precio']
  productos: ProductoOfertado[] = []

  constructor(private dataManagement: DataManagementService,
              private dialogRef: MatDialogRef<DetallesMenuDialogComponent>) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    if(this.dataManagement.selectedMenu) {
      this.menu = this.dataManagement.selectedMenu;
      this.dataSource.push(this.menu)
      this.titulo = 'Menu ' + this.dataManagement.selectedMenu.nombre
      if(this.menu.id) this.productos = await this.dataManagement.getProductosByMenuId(this.menu.id)
    }
  }

  onClose() {
    this.dialogRef.close()
  }

}
