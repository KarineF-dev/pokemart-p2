import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../../models/produto';
import { Cesta } from '../../models/cesta';
import { ProdutoService } from '../../services/produto-service';

@Component({
  selector: 'app-resulta-busca',
  imports: [CommonModule],
  templateUrl: './resulta-busca.html',
  styleUrl: './resulta-busca.css',
})
export class ResultaBusca {
  busca: string = '';
  lista: Produto[] = [];
  cesta: Cesta = new Cesta();
  mensagem: string = '';
  erro: string = '';
  carregando: boolean = true;

  constructor(private route: ActivatedRoute, private service: ProdutoService, private cd: ChangeDetectorRef) {
    this.busca = this.route.snapshot.queryParams['busca'] || '';

    // busca vazia: mostra todos os produtos (a API não aceita termo em branco)
    let resposta;
    if (this.busca.trim() == '') {
      resposta = this.service.listar();
    } else {
      resposta = this.service.fazerBusca(this.busca.trim());
    }

    resposta.subscribe({
      next: (dados) => {
        this.lista = dados;
        this.carregando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.erro = 'Não foi possível fazer a busca. Tente novamente mais tarde.';
        this.carregando = false;
        this.cd.detectChanges();
      }
    });
  }

  comprar(produto: Produto) {
    this.cesta.adicionar(produto);
    this.mensagem = produto.nome + ' adicionado à cesta!';
  }
}
