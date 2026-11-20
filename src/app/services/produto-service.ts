import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  url = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  buscar(codigo: number): Observable<any> {
    return this.http.get(this.url + '/produto/' + codigo);
  }

  listar(): Observable<any> {
    return this.http.get(this.url + '/produtos');
  }

  carregarVitrine(): Observable<any> {
    return this.http.get(this.url + '/produto/vitrine');
  }

  fazerBusca(termo: string): Observable<any> {
    // encodeURIComponent troca espaço e acento por códigos que podem ir na URL
    return this.http.get(this.url + '/produto/busca/' + encodeURIComponent(termo));
  }

  gravar(obj: Produto): Observable<any> {
    return this.http.post(this.url + '/produto', obj, { responseType: 'text' });
  }

  alterar(obj: Produto): Observable<any> {
    return this.http.put(this.url + '/produto', obj, { responseType: 'text' });
  }

  apagar(codigo: number): Observable<any> {
    return this.http.delete(this.url + '/produto/' + codigo, { responseType: 'text' });
  }
}
