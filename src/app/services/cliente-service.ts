import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  url = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  buscar(codigo: number): Observable<any> {
    return this.http.get(this.url + '/cliente/' + codigo);
  }

  gravar(obj: Cliente): Observable<any> {
    return this.http.post(this.url + '/cliente', obj, { responseType: 'text' });
  }

  alterar(obj: Cliente): Observable<any> {
    return this.http.put(this.url + '/cliente', obj, { responseType: 'text' });
  }

  apagar(codigo: number): Observable<any> {
    return this.http.delete(this.url + '/cliente/' + codigo, { responseType: 'text' });
  }

  login(obj: Cliente): Observable<any> {
    return this.http.post(this.url + '/cliente/login', obj);
  }

  resetarSenha(obj: Cliente): Observable<any> {
    return this.http.patch(this.url + '/cliente/resetarSenha', obj, { responseType: 'text' });
  }

  alterarSenha(obj: Cliente): Observable<any> {
    return this.http.patch(this.url + '/cliente/alterarSenha', obj, { responseType: 'text' });
  }
}
