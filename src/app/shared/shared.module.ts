import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialWidgetsModule } from './widgets/material-widgets.module';
import { ConfirmComponent } from './dialog/confirm/confirm.component';



@NgModule({
  declarations: [ConfirmComponent],
  imports: [
    CommonModule,
    MaterialWidgetsModule
  ],
  exports:[MaterialWidgetsModule , ConfirmComponent]
})
export class SharedModule { }
