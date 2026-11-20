import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../models/pedido';
import { PedidoService } from '../../services/pedido-service';

@Component({
  selector: 'app-meus-pedidos',
  imports: [CommonModule],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css',
})
export class MeusPedidos {
  pedidos: Pedido[] = [];
  usuario: any = null;
  carregando: boolean = true;
  erro: string = '';

  constructor(private service: PedidoService, private cd: ChangeDetectorRef) {
    this.usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

    if (this.usuario == null) {
      window.location.href = 'login';
      return;
    }

    // GET /api/pedidos/cliente/{codigo}: já vem do mais recente para o mais antigo
    this.service.listarPorCliente(this.usuario.codigo).subscribe({
      next: (dados) => {
        this.pedidos = dados;
        this.carregando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.erro = 'Não foi possível carregar seus pedidos. Tente mais tarde.';
        this.carregando = false;
        this.cd.detectChanges();
      }
    });
  }

  nomePagamento(tipo: string): string {
    if (tipo == 'pix') return 'Pix';
    if (tipo == 'cartao') return 'Cartão de crédito';
    return 'Boleto bancário';
  }
}
