import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto } from '../../models/produto';
import { Cesta } from '../../models/cesta';
import { ProdutoService } from '../../services/produto-service';

@Component({
  selector: 'app-destaques',
  imports: [CommonModule],
  templateUrl: './destaques.html',
  styleUrl: './destaques.css',
})
export class Destaques {
  lista: Produto[] = [];
  cesta: Cesta = new Cesta();
  mensagem: string = '';

  constructor(private service: ProdutoService, private cd: ChangeDetectorRef) {
    // GET /api/produto/vitrine devolve só os produtos com destaque
    this.service.carregarVitrine().subscribe({
      next: (dados) => {
        for (let produto of dados) {
          if (this.lista.length < 6) {
            this.lista.push(produto);
          }
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        // se a API estiver fora do ar, a seção de destaques fica vazia
        this.lista = [];
      }
    });
  }

  desconto(produto: Produto): number {
    return Math.round((1 - produto.valorPromo / produto.valor) * 100);
  }

  comprar(produto: Produto) {
    this.cesta.adicionar(produto);
    this.mensagem = produto.nome + ' adicionado à cesta!';
  }

  comprarAgora(produto: Produto) {
    this.cesta.adicionar(produto);
    window.location.href = 'carrinho';
  }
}
