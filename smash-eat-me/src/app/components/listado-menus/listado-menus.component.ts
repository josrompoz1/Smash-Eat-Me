import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Menu } from 'src/app/Models/types';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { DetallesMenuDialogComponent } from '../detalles-menu-dialog/detalles-menu-dialog.component';
import { MenuDialogComponent } from '../menu-dialog/menu-dialog.component';

@Component({
  selector: 'app-listado-menus',
  templateUrl: './listado-menus.component.html',
  styleUrls: ['./listado-menus.component.css', '../styles.css']
})
export class ListadoMenusComponent implements OnInit {

  menus: Menu[] = []
  displayedColumns: string[] = ['nombre', 'descripcion', 'precio', 'detalles', 'editar', 'eliminar'];

  constructor(private dataManagement: DataManagementService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getData()
  }

  private async getData() {
    this.menus = await this.dataManagement.getMenus()
  }

  public abrirDetallesDialog(element: Menu) {
    this.dataManagement.selectedMenu = element;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = "90%";
    dialogConfig.height = "90%"
    let dialogRef = this.dialog.open(DetallesMenuDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.dataManagement.selectedMenu = undefined;
    })
  }

  public async deleteMenu(element: Menu) {
    if(element.id) await this.dataManagement.deleteMenu(element.id).then(() => {
      this.getData()
    })
  }

  public abrirMenuDialog(element?: Menu) {
    if(element) {
      this.dataManagement.selectedMenu = element;
    }    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = "70%";
    dialogConfig.height = "70%"
    let dialogRef = this.dialog.open(MenuDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.dataManagement.selectedMenu = undefined;
      this.getData()
    })
  }

}
