import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
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
export class DialogAddEditComponent implements OnInit {

  formEmpleado: FormGroup;
  tituloAccion: string = "Nuevo Empleado";
  botonAccion: string = "Guardar";
  listaDepartamento: Departamento[] = [];

  constructor(
    private dialogoReferencia: MatDialogRef<DialogAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _departamentoServicio: DepartamentoService,
    private _empleadoServicio: EmpleadoService,
    @Inject(MAT_DIALOG_DATA) public dataEmpleado: Empleado
  ) {
    // Crear un FormGroup con campos y validadores
    this.formEmpleado = this.fb.group({
      nombreCompleto: ["", Validators.required],
      idDepartamento: ["", Validators.required],
      sueldo: ["", Validators.required],
      fechaContrato: ["", Validators.required],
    });

    // Obtener la lista de departamentos del servicio
    this._departamentoServicio.getAll().subscribe({
      next: (data) => {
        this.listaDepartamento = data;
      },
      error: (error) => {
        console.error("Error al obtener la lista de departamentos:", error);
      }
    });
  }

  ngOnInit(): void {
    if (this.dataEmpleado) {
      // Rellenar el formulario con los datos del empleado para la edición
      this.formEmpleado.patchValue({
        idEmpleado: this.dataEmpleado.idEmpleado,
        idDepartamento: this.dataEmpleado.idDepartamento,
        nombreCompleto: this.dataEmpleado.nombreCompleto,
        sueldo: this.dataEmpleado.sueldo,
        fechaContrato: moment(this.dataEmpleado.fechaContrato, 'DD/MM/YYYY')
      });

      this.tituloAccion = "Editar Empleado";
      this.botonAccion = "Actualizar";
    }
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
      idEmpleado: this.dataEmpleado ? this.dataEmpleado.idEmpleado : 0,
      idDepartamento: this.formEmpleado.value.idDepartamento,
      nombreCompleto: this.formEmpleado.value.nombreCompleto,
      sueldo: this.formEmpleado.value.sueldo,
      fechaContrato: moment(this.formEmpleado.value.fechaContrato).format("DD/MM/YYYY")
    };

    if (this.dataEmpleado == null) {
      // Llamar al servicio para crear un nuevo empleado
      this._empleadoServicio.create(modelo).subscribe({
        next: (data) => {
          this.mostrarAlerta("Empleado Fue Creado", "Listo");
          this.dialogoReferencia.close("creado");  // Cerrar el cuadro de diálogo
        },
        error: (err) => {
          console.error("Error al crear un Empleado:", err);
          this.mostrarAlerta("Error al crear un Empleado", "Error");
        },
      });
    } else {
      // Llamar al servicio para editar un empleado
      this._empleadoServicio.update(this.dataEmpleado.idEmpleado, modelo).subscribe({
        next: (data) => {
          this.mostrarAlerta("Empleado Fue Editado", "Listo");
          this.dialogoReferencia.close("editado");  // Cerrar el cuadro de diálogo
        },
        error: (err) => {
          console.error("Error al editar el Empleado:", err);
          this.mostrarAlerta("Error al editar el Empleado", "Error");
        },
      });
    }
  }
}
