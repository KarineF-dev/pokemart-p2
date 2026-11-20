import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../../models/produto';
import { Cesta } from '../../models/cesta';
import { ProdutoService } from '../../services/produto-service';

@Component({
  selector: 'app-vitrine',
  imports: [CommonModule],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.css',
})
export class Vitrine {
  lista: Produto[] = [];
  categoria: string = '';
  busca: string = '';
  categorias: string[] = ['Poções e Saúde', 'Equipamentos', 'Pokébolas', 'Acessórios', 'Alimentos', 'EvolutionStone', 'Ofertas'];
  cesta: Cesta = new Cesta();
  mensagem: string = '';
  erro: string = '';
  carregando: boolean = true;

  constructor(private route: ActivatedRoute, private service: ProdutoService, private cd: ChangeDetectorRef) {
    this.categoria = this.route.snapshot.queryParams['categoria'] || '';
    this.busca = this.route.snapshot.queryParams['busca'] || '';

    // GET /api/produtos traz todos os produtos; o filtro por categoria é feito aqui
    this.service.listar().subscribe({
      next: (dados) => {
        for (let produto of dados) {
          let passaCategoria = this.categoria == ''
            || produto.categoria == this.categoria
            || (this.categoria == 'Ofertas' && produto.destaque == 1);

          let passaBusca = produto.nome.toLowerCase().includes(this.busca.toLowerCase());

          if (passaCategoria && passaBusca) {
            this.lista.push(produto);
          }
        }
        this.carregando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.erro = 'Não foi possível carregar os produtos. Tente novamente mais tarde.';
        this.carregando = false;
        this.cd.detectChanges();
      }
    });
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
