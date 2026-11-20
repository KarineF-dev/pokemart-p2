import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../../models/produto';
import { Cesta } from '../../models/cesta';
import { ProdutoService } from '../../services/produto-service';

@Component({
  selector: 'app-detalhe',
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhe.html',
  styleUrl: './detalhe.css',
})
export class Detalhe {
  produto: Produto = new Produto();
  encontrado: boolean = false;
  carregando: boolean = true;
  quantidade: number = 1;
  mensagem: string = '';
  cesta: Cesta = new Cesta();

  constructor(private route: ActivatedRoute, private service: ProdutoService, private cd: ChangeDetectorRef) {
    let codigo = Number(this.route.snapshot.params['codigo']);

    // GET /api/produto/{codigo}: se não existir, a API devolve um objeto vazio
    this.service.buscar(codigo).subscribe({
      next: (dados) => {
        if (dados.codigo > 0) {
          this.produto = dados;
          this.encontrado = true;
        }
        this.carregando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.carregando = false;
        this.cd.detectChanges();
      }
    });
  }

  economia(): number {
    return this.produto.valor - this.produto.valorPromo;
  }

  comprar() {
    this.cesta.adicionar(this.produto, this.quantidade);
    this.mensagem = this.quantidade + ' unidade(s) de ' + this.produto.nome + ' adicionada(s) à cesta.';
  }
}
