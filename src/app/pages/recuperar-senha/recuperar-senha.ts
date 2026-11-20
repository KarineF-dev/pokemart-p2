import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente-service';

@Component({
  selector: 'app-recuperar-senha',
  imports: [FormsModule],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css',
})
export class RecuperarSenha {
  // etapa 1: informa o e-mail | etapa 2: troca a senha | etapa 3: concluído
  etapa = 1;
  email = '';
  senhaTemporaria = '';
  novaSenha = '';
  mensagem = '';
  retorno = '';
  tentou = false;

  constructor(private service: ClienteService, private cd: ChangeDetectorRef) {}

  enviar(formularioValido: boolean | null) {
    this.tentou = true;

    if (!formularioValido) {
      this.mensagem = 'Informe um e-mail válido.';
      return;
    }

    let obj = new Cliente();
    obj.email = this.email;

    // PATCH /api/cliente/resetarSenha: troca a senha por uma temporária e desativa a conta
    this.service.resetarSenha(obj).subscribe({
      next: (dados) => {
        this.retorno = dados;
        this.mensagem = '';
        this.tentou = false;
        this.etapa = 2;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.mensagem = 'Não foi possível conectar ao servidor. Tente mais tarde.';
        this.cd.detectChanges();
      }
    });
  }

  alterar(formularioValido: boolean | null) {
    this.tentou = true;

    if (!formularioValido) {
      this.mensagem = 'Corrija os campos destacados em vermelho.';
      return;
    }

    let obj = new Cliente();
    obj.email = this.email;
    obj.senha = this.novaSenha;
    // Atenção: no backend, o método alterarSenha usa o campo "documento"
    // como a senha ANTIGA (ClienteController chama bd.alterarSenha(senha, documento, email)).
    obj.documento = this.senhaTemporaria;

    // PATCH /api/cliente/alterarSenha: grava a nova senha e reativa a conta
    this.service.alterarSenha(obj).subscribe({
      next: (dados) => {
        this.retorno = dados;
        this.mensagem = '';
        this.etapa = 3;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.mensagem = 'Não foi possível conectar ao servidor. Tente mais tarde.';
        this.cd.detectChanges();
      }
    });
  }
}
