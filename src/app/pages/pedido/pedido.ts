import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cesta } from '../../models/cesta';
import { Pedido as PedidoModel } from '../../models/pedido';
import { ItemPedido } from '../../models/item-pedido';
import { PedidoService } from '../../services/pedido-service';

@Component({
  selector: 'app-pedido',
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css',
})
export class Pedido {
  cesta: Cesta = new Cesta();
  usuario: any = null;
  pagamento: string = 'pix';
  frete: number = 19.90;
  concluido: boolean = false;
  enviando: boolean = false;
  numeroPedido: number = 0;
  mensagem: string = '';

  constructor(private service: PedidoService, private cd: ChangeDetectorRef) {
    this.usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

    if (this.usuario == null) {
      window.location.href = 'login';
    }
  }

  desconto(): number {
    if (this.pagamento == 'pix') {
      return this.cesta.total() * 0.05;
    }
    return 0;
  }

  totalFinal(): number {
    return this.cesta.total() + this.frete - this.desconto();
  }

  confirmar() {
    // monta o pedido no formato que o backend espera
    let pedido = new PedidoModel();
    pedido.codigoCliente = this.usuario.codigo;
    pedido.valorTotal = this.totalFinal();
    pedido.entrega = this.usuario.logradouro;
    pedido.pagamento = this.pagamento;

    for (let item of this.cesta.itens) {
      let itemPedido = new ItemPedido();
      itemPedido.codigoProduto = item.produto.codigo;
      itemPedido.nome = item.produto.nome;
      itemPedido.quantidade = item.quantidade;
      itemPedido.valor = item.produto.valorPromo;
      pedido.itens.push(itemPedido);
    }

    this.enviando = true;

    // POST /api/pedido: a resposta é um texto "Pedido gravado com sucesso! 7"
    this.service.gravar(pedido).subscribe({
      next: (dados) => {
        // o número do pedido é o que vem depois do último espaço
        this.numeroPedido = Number(dados.substring(dados.lastIndexOf(' ') + 1));
        this.cesta.limpar();
        this.concluido = true;
        this.enviando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.mensagem = 'Não foi possível registrar o pedido. Tente novamente.';
        this.enviando = false;
        this.cd.detectChanges();
      }
    });
  }
}
