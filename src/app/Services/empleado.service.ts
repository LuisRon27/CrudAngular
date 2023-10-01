import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environment';
import { Empleado } from './../Interfaces/empleado';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private urlApi: string = environment.apiEndpoint + 'Empleado';

  constructor(private http: HttpClient) { }

  // Método GET para obtener todos
  getAll(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.urlApi}/lista`);
  }

  // Método GET para obtener por ID
  getById(id: number): Observable<Empleado> {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Empleado>(url);
  }

  // Método POST para crear
  create(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.urlApi, empleado);
  }

  // Método PUT para actualizar
  update(id: number, empleado: Empleado): Observable<Empleado> {
    const url = `${this.urlApi}/${id}`;
    return this.http.put<Empleado>(url, empleado);
  }

  // Método DELETE para eliminar por ID
  delete(id: number): Observable<any> {
    const url = `${this.urlApi}/${id}`;
    return this.http.delete(url);
  }
}
