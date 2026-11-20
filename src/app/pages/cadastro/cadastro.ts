import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente-service';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  obj: Cliente = new Cliente();
  mensagem = '';
  sucesso = '';
  tentou = false;
  editando = false;

  constructor(private service: ClienteService, private cd: ChangeDetectorRef) {
    // Logado: a tela vira "Meus dados" e carrega o cadastro pela API
    let usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

    if (usuario != null) {
      this.editando = true;
      this.service.buscar(usuario.codigo).subscribe({
        next: (dados) => {
          this.obj = dados;
          this.cd.detectChanges();
        },
        error: (err) => {
          this.mensagem = 'Não foi possível carregar seus dados.';
          this.cd.detectChanges();
        }
      });
    }
  }

  cadastrar(formularioValido: boolean | null) {
    this.tentou = true;
    this.sucesso = '';

    if (!formularioValido) {
      this.mensagem = 'Corrija os campos destacados em vermelho.';
      return;
    }

    this.mensagem = '';

    if (this.obj.codigo == 0) {
      // novo cliente: POST /api/cliente
      this.obj.ativo = 1; // o login só aceita clientes ativos
      this.service.gravar(this.obj).subscribe({
        next: (dados) => {
          alert('Cadastro realizado com sucesso!');
          window.location.href = 'login';
        },
        error: (err) => {
          this.mensagem = 'Ocorreu um erro ao gravar o cadastro.';
          this.cd.detectChanges();
        }
      });
    } else {
      // cliente existente: PUT /api/cliente
      this.service.alterar(this.obj).subscribe({
        next: (dados) => {
          let usuario = JSON.parse(JSON.stringify(this.obj)); // cópia do objeto
          usuario.senha = '';
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          this.sucesso = 'Dados atualizados com sucesso!';
          this.cd.detectChanges();
        },
        error: (err) => {
          this.mensagem = 'Ocorreu um erro ao alterar o cadastro.';
          this.cd.detectChanges();
        }
      });
    }
  }
}
