import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  senha = '';
  lembrar = false;
  mensagem = '';
  tentou = false;

  constructor(private service: ClienteService, private cd: ChangeDetectorRef) {
    // conta de demonstração que já vem cadastrada no banco (data.sql do backend)
    this.email = 'karine@pokemart.com';
    this.senha = 'Teste@123';
  }

  entrar(formularioValido: boolean | null) {
    this.tentou = true;

    if (!formularioValido) {
      this.mensagem = 'Preencha os campos corretamente.';
      return;
    }

    let obj = new Cliente();
    obj.email = this.email;
    obj.senha = this.senha;

    // POST /api/cliente/login: devolve o cliente, ou um objeto vazio se errar
    this.service.login(obj).subscribe({
      next: (dados) => {
        if (dados.codigo > 0) {
          dados.senha = ''; // não deixa a senha guardada no navegador
          localStorage.setItem('usuarioLogado', JSON.stringify(dados));
          window.location.href = '/';
        } else {
          this.mensagem = 'E-mail ou senha incorretos.';
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        this.mensagem = 'Não foi possível conectar ao servidor. Tente mais tarde.';
        this.cd.detectChanges();
      }
    });
  }
}
