import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';  // Importación de la biblioteca Moment.js
import { Departamento } from '../../Interfaces/departamento';
import { Empleado } from '../../Interfaces/empleado';
import { DepartamentoService } from 'src/app/Services/departamento.service';
import { EmpleadoService } from 'src/app/Services/empleado.service';

// Definición de formatos de fecha personalizados para Angular Material Datepicker
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }  // Proporcionar formatos de fecha personalizados a Angular Material
  ]
})
export class DialogAddEditComponent {

  formEmpleado: FormGroup;
  tituloAccion: string = "Nuevo Empleado";
  botonAccion: string = "Guardar";
  listaDepartamento: Departamento[] = [];

  constructor(
    private dialogoReferencia: MatDialogRef<DialogAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _departamentoServicio: DepartamentoService,
    private _empleadoServicio: EmpleadoService
  ) {
    // Crear un FormGroup con campos y validadores
    this.formEmpleado = this.fb.group({
      nombreCompleto: ["", Validators.required],
      idDepartamento: ["", Validators.required],
      sueldo: ["", Validators.required],
      fechaContrato: ["", Validators.required],
    })

    // Obtener la lista de departamentos del servicio
    this._departamentoServicio.getAll().subscribe({
      next: (data) => {
        this.listaDepartamento = data;
        console.log(data);
      }, error: (error) => {

      }
    })
  }

  // Función para mostrar una notificación emergente (SnackBar)
  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  // Función para agregar o editar un empleado
  addEditEmpleado() {

    // Crear un objeto de tipo Empleado con los datos del formulario
    const modelo: Empleado = {
      idEmpleado: 0,
      idDepartamento: this.formEmpleado.value.idDepartamento,
      nombreCompleto: this.formEmpleado.value.nombreCompleto,
      sueldo: this.formEmpleado.value.sueldo,
      fechaContrato: moment(this.formEmpleado.value.fechaContrato).format("DD/MM/YYYY")  // Formatear la fecha con Moment.js
    }

    // Llamar al servicio para crear un nuevo empleado y suscribirse para manejar respuestas
    this._empleadoServicio.create(modelo).subscribe({
      next: (data) => {
        this.mostrarAlerta("Empleado Fue Creado", "Listo");
        this.dialogoReferencia.close("creado");  // Cerrar el cuadro de diálogo
      }, error: (err) => {
        this.mostrarAlerta("Error al crear un Empleado", "Error");  // Mostrar notificación de error
      },
    })
  }
}
