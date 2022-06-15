import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataManagementService } from 'src/app/Services/data-management.service';

@Component({
  selector: 'app-productos-dialog',
  templateUrl: './productos-dialog.component.html',
  styleUrls: ['./productos-dialog.component.css']
})
export class ProductosDialogComponent implements OnInit {

  constructor(public dataManagement: DataManagementService, private dialogRef: MatDialogRef<ProductosDialogComponent>) { }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }

}
