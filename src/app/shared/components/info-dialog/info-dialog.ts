import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface InfoDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './info-dialog.html',
  styleUrls: ['./info-dialog.scss']
})
export class InfoDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: InfoDialogData) {}
}
