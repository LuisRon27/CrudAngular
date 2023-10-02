import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environment';
import { Departamento } from '../Interfaces/departamento';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private urlApi: string = environment.apiEndpoint + 'Departamento';

  constructor(private http: HttpClient) { }

  // Método GET para obtener todos
  getAll(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.urlApi}/lista`);
  }

  // Método GET para obtener por ID
  getById(id: number): Observable<Departamento> {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Departamento>(url);
  }

  // Método POST para crear
  create(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.urlApi, departamento);
  }

  // Método PUT para actualizar
  update(id: number, departamento: Departamento): Observable<Departamento> {
    const url = `${this.urlApi}/${id}`;
    return this.http.put<Departamento>(url, departamento);
  }

  // Método DELETE para eliminar por ID
  delete(id: number): Observable<any> {
    const url = `${this.urlApi}/${id}`;
    return this.http.delete(url);
  }
}
