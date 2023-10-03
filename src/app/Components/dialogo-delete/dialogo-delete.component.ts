import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Empleado } from '../../Interfaces/empleado';



@Component({
  selector: 'app-dialogo-delete',
  templateUrl: './dialogo-delete.component.html',
  styleUrls: ['./dialogo-delete.component.css']
})
export class DialogoDeleteComponent {

  constructor(
    private dialogoReferencia: MatDialogRef<DialogoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public dataEmpleado: Empleado
  ) {}

  confirmar_Eliminar(){
    if (this.dataEmpleado) {
      this.dialogoReferencia.close("eliminar")
    }
  }

}
