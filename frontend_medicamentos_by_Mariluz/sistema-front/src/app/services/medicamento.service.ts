import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicamento } from '../interfaces/medicamento.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  private apiUrl = 'http://127.0.0.1:8000/medicamentos/';

  constructor(private http: HttpClient) {}

  getMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(this.apiUrl);
  }

  postMedicamento(medicamento: Partial<Medicamento>): Observable<Medicamento> {
    return this.http.post<Medicamento>(`${this.apiUrl}crear/`, medicamento);
  }

  putMedicamento(id: number, medicamento: Partial<Medicamento>): Observable<Medicamento> {
    return this.http.put<Medicamento>(`${this.apiUrl}actualizar/`, { ...medicamento, id });
  }

  deleteMedicamento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}eliminar/${id}/`);
  }
}