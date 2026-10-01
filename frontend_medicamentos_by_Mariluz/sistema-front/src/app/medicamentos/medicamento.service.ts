import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Medicamento } from '../interfaces/medicamento.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  private apiUrl = 'http://localhost:8000/medicamentos';

  constructor(private http: HttpClient) {}

  // GET
  getMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(this.apiUrl);
  }

  // POST
  postMedicamento(medicamento: Medicamento): Observable<Medicamento> {
    return this.http.post<Medicamento>(
      this.apiUrl,
      medicamento
    );
  }

  // PUT
  putMedicamento(
    id: number,
    medicamento: Medicamento
  ): Observable<Medicamento> {
    return this.http.put<Medicamento>(
      `${this.apiUrl}/${id}`,
      medicamento
    );
  }

  // DELETE
  deleteMedicamento(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}