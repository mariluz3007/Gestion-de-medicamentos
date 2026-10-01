import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  ResultResponse,
  Result,
  ResultResponsePaginator,
} from '../interfaces/globalInterface';
import { Cliente } from '../interfaces/clientInterface';

type ResultClient = Result | undefined;
type ClientArray = ResultResponse<Cliente[]>;
type ClientPaginatorArray = ResultResponsePaginator<Cliente[]>;

const myApp: string = 'myapp/clientes/';

@Injectable({
  providedIn: 'root',
})
export class ApiCliente {
  constructor(private http: HttpClient) {}

  async getClientesIndex(): Promise<ClientArray> {
    const result = this.http.get(environment.api_url + myApp);
    return firstValueFrom(result as Observable<ClientArray>);
  }

  async getClientesEliminados(): Promise<ClientArray> {
    const result = this.http.get(environment.api_url + myApp + 'eliminados');
    return firstValueFrom(result as Observable<ClientArray>);
  }

  async getClientesView(id: number): Promise<ClientArray> {
    const result = this.http.get(environment.api_url + myApp + 'view?id=' + id);
    return firstValueFrom(result as Observable<ClientArray>);
  }

  async getClientesPaginados(
    curren_page: number,
    filter: string = '',
  ): Promise<ClientPaginatorArray> {
    const result = this.http.get(
      environment.api_url +
        myApp +
        'paginator?page=' +
        curren_page +
        '&filter=' +
        filter,
    );
    return firstValueFrom(result as Observable<ClientPaginatorArray>);
  }

  async addCliente(request: Object): Promise<ResultClient> {
    const result = this.http.post(
      environment.api_url + myApp + 'add',
      request,
    );
    return firstValueFrom(result as Observable<ResultClient>);
  }

  async updateCliente(request: Object): Promise<ResultClient> {
    const result = this.http.put(
      environment.api_url + myApp + 'update',
      request,
    );
    return firstValueFrom(result as Observable<ResultClient>);
  }

  async deleteCliente(id: number): Promise<ResultClient> {
    const result = this.http.delete(
      environment.api_url + myApp + 'delete?id=' + id
    );
    return firstValueFrom(result as Observable<ResultClient>);
  }
}