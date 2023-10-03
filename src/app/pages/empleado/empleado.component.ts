import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Empleado } from '../../Interfaces/empleado';
import { EmpleadoService } from './../../Services/empleado.service';
import { DialogAddEditComponent } from 'src/app/Components/dialog-add-edit/dialog-add-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogoDeleteComponent } from '../../Components/dialogo-delete/dialogo-delete.component';


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['NombreCompleto', 'Departamento', 'Sueldo', 'FechaContrato', 'Acciones'];
  dataSource = new MatTableDataSource<Empleado>();

  constructor(private _empleadoServicio: EmpleadoService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.mostrarEmpleados();
  }

  // Referencia al paginador de la tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    // Asignar el paginador a la fuente de datos
    this.dataSource.paginator = this.paginator;
  }

  // Filtrar la tabla en función del valor ingresado en el campo de búsqueda
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Obtener y mostrar la lista de empleados
  mostrarEmpleados() {
    this._empleadoServicio.getAll().subscribe({
      next: (dataResponse) => {
        console.log(dataResponse);
        this.dataSource.data = dataResponse;
      },
      error: (err) => {
        console.log("Error al mostrar empleados");
      }
    });
  }

  // Abrir el diálogo para agregar un nuevo empleado
  dialogoNuevoEmpleado() {
    this.dialog.open(DialogAddEditComponent, {
      disableClose: true,
      width: "350px"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarEmpleados(); // Actualizar la lista de empleados si se crea uno nuevo
      }
    });
  }

  // Abrir el diálogo para editar un empleado
  dialogoEditarEmpleado(dataEmpleado: Empleado) {
    this.dialog.open(DialogAddEditComponent, {
      disableClose: true,
      width: "350px",
      data: dataEmpleado
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        this.mostrarEmpleados(); // Actualizar la lista de empleados
      }
    });
  }

  // Función para mostrar una notificación emergente (SnackBar)
  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  // Abrir el diálogo para Eliminar un empleado
  dialogoEliminarEmpleado(dataEmpleado: Empleado) {
    this.dialog.open(DialogoDeleteComponent, {
      disableClose: true,
      data: dataEmpleado
    }).afterClosed().subscribe(resultado => {
      if (resultado === "eliminar") {
        this._empleadoServicio.delete(dataEmpleado.idEmpleado).subscribe({
          next: (data) => {
            this.mostrarAlerta("Empleado Fue Eliminado","Listo");
            this.mostrarEmpleados();
          }, error: (err) => {
            console.log(err);
          }
        })
      }
    });
  }
}
