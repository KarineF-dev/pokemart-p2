import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  url = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  buscar(codigo: number): Observable<any> {
    return this.http.get(this.url + '/pedido/' + codigo);
  }

  gravar(obj: Pedido): Observable<any> {
    return this.http.post(this.url + '/pedido', obj, { responseType: 'text' });
  }

  alterar(obj: Pedido): Observable<any> {
    return this.http.put(this.url + '/pedido', obj, { responseType: 'text' });
  }

  apagar(codigo: number): Observable<any> {
    return this.http.delete(this.url + '/pedido/' + codigo, { responseType: 'text' });
  }

  listarPorCliente(codigoCliente: number): Observable<any> {
    return this.http.get(this.url + '/pedidos/cliente/' + codigoCliente);
  }
}
