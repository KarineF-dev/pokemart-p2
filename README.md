# PokéMart

Loja virtual fictícia de itens do universo Pokémon. Front end em Angular (P1) integrado a um back end em Java com Spring Boot (P2).

![PokéMart](docs/pokemart_print.png)

O projeto simula uma experiência completa de e-commerce: catálogo com filtro por categoria, busca, página de detalhe do produto, carrinho de compras, finalização de pedido, histórico de compras e telas de login e cadastro com validação de formulário.

## Tecnologias

- **Angular 22** com componentes standalone
- **TypeScript**
- **HTML5** com tags semânticas
- **CSS3** com variáveis para o tema da loja
- **Bootstrap 5.3** para grid, componentes e responsividade
- **Bootstrap Icons**
- **HttpClient** do Angular para consumir a API
- **Java 21 + Spring Boot** (back end "lojinha" fornecido pelo professor) com banco **SQLite**
- **localStorage** apenas para o carrinho e para saber quem está logado

## Funcionalidades

**Catálogo**
- 62 produtos divididos em 6 categorias
- Filtro por categoria pelo menu, pelos cards da home e pelos botões da vitrine
- Categoria especial "Ofertas", que reúne os produtos em promoção
- Busca por nome do produto em página própria de resultados
- Selos de oferta e de produto esgotado
- Preço original riscado ao lado do preço promocional

**Produto**
- Página de detalhe com descrição, estoque e cálculo da economia
- Seleção de quantidade
- Botão de compra desabilitado quando o produto está sem estoque

**Compra**
- Carrinho com alteração de quantidade, remoção de itens e cálculo de subtotal e total
- Contador de itens no ícone do carrinho
- Finalização com escolha de forma de pagamento e desconto automático de 5% no Pix
- Geração de número do pedido e tela de confirmação
- Histórico de pedidos do usuário logado

**Conta**
- Cadastro com validação de nome, e-mail, senha forte, documento, telefone e endereço
- Login conferido na API (só entra com e-mail e senha cadastrados)
- Tela "Meus dados" para alterar o cadastro
- Recuperação de senha em duas etapas (senha temporária e nova senha)
- Menu de conta no cabeçalho com acesso aos pedidos e opção de sair

**Layout**
- Responsivo, adaptando a grade de produtos e o menu conforme o tamanho da tela
- Menu em formato hambúrguer em telas pequenas
- Cabeçalho transparente sobre o banner na página inicial

## Telas

### Página inicial
![Home](docs/pokemart_print.png)

### Vitrine com filtro por categoria
![Vitrine](docs/pokemart_print_vitrine.png)

### Carrinho
![Carrinho](docs/pokemart_print_carrinho.png)

### Finalização do pedido
![Pedido](docs/pokemart_print_pedido.png)

### Login
![Login](docs/pokemart_print_login.png)

### Cadastro
![Cadastro](docs/pokemart_print_cadastro.png)

## Integração com o back end (P2)

O back end fica na pasta `backend/` e responde em `http://localhost:8081`. O front chama a API pelos services em `src/app/services/`.

| Tela | Service | Endpoint |
|---|---|---|
| Home (destaques) | `ProdutoService.carregarVitrine()` | `GET /api/produto/vitrine` |
| Vitrine | `ProdutoService.listar()` | `GET /api/produtos` |
| Busca | `ProdutoService.fazerBusca()` | `GET /api/produto/busca/{termo}` |
| Detalhe | `ProdutoService.buscar()` | `GET /api/produto/{codigo}` |
| Login | `ClienteService.login()` | `POST /api/cliente/login` |
| Cadastro | `ClienteService.gravar()` | `POST /api/cliente` |
| Meus dados | `ClienteService.buscar()` e `alterar()` | `GET /api/cliente/{codigo}` e `PUT /api/cliente` |
| Recuperar senha | `ClienteService.resetarSenha()` e `alterarSenha()` | `PATCH /api/cliente/resetarSenha` e `/alterarSenha` |
| Finalizar pedido | `PedidoService.gravar()` | `POST /api/pedido` |
| Meus pedidos | `PedidoService.listarPorCliente()` | `GET /api/pedidos/cliente/{codigo}` |

Os services também têm os métodos de alterar e excluir produto e pedido, e excluir cliente, prontos para uso.

### O que mudou no back end

O back end do professor foi usado como base, com estes ajustes para atender a loja:

- `Produto`: campo `categoria`, usado no filtro da vitrine
- `Pedido`: campo `pagamento` e o relacionamento com `ItemPedido` (que estava comentado) ativado, para o pedido gravar os itens junto
- `ItemPedido`: campo `nome`, que guarda o nome do produto no momento da compra
- `PedidoController`: grava a data do pedido, liga cada item ao pedido e tem o novo endpoint `GET /api/pedidos/cliente/{codigo}`; a mensagem "Cliente gravado com sucesso" do pedido foi corrigida para "Pedido gravado com sucesso"
- `data.sql`: carga inicial com os 62 produtos e um cliente de demonstração, executada sempre que o back end sobe (`INSERT OR IGNORE`, não duplica)

## Estrutura do projeto

```
backend/            API em Spring Boot (porta 8081)
src/app/
├── components/     partes reaproveitadas em várias páginas
│   ├── header/
│   ├── hero/
│   ├── categorias/
│   ├── destaques/
│   ├── beneficios/
│   └── footer/
├── models/         classes
│   ├── produto.ts
│   ├── cliente.ts
│   ├── pedido.ts
│   ├── item-pedido.ts
│   ├── item-cesta.ts
│   └── cesta.ts
├── services/       chamadas à API
│   ├── produto-service.ts
│   ├── cliente-service.ts
│   └── pedido-service.ts
├── pages/          telas da loja
│   ├── home/
│   ├── vitrine/
│   ├── resulta-busca/
│   ├── detalhe/
│   ├── carrinho/
│   ├── pedido/
│   ├── meus-pedidos/
│   ├── login/
│   ├── cadastro/
│   └── recuperar-senha/
└── app.routes.ts   rotas da aplicação
```

As imagens dos produtos ficam em `public/imagens/produtos/` e são nomeadas pelo código do produto, então o produto de código 1 usa o arquivo `1.jpg`.

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) na versão LTS e o **JDK 21**.

**1. Back end** (deixar rodando em um terminal):

```bash
cd backend
./mvnw spring-boot:run        # no Windows: mvnw.cmd spring-boot:run
```

Ou, no VS Code com o Extension Pack for Java, abrir `backend/src/main/java/com/ads/lojinha/LojinhaApplication.java` e clicar em **Run**. Na primeira vez o banco `lojinha.db` é criado e já recebe os produtos.

**2. Front end** (em outro terminal, na raiz do projeto):

```bash
npm install
npm start
```

Depois é só abrir `http://localhost:4200` no navegador. Conta de demonstração: `karine@pokemart.com` / `Teste@123`.

## Observações

Este é um projeto acadêmico. Produtos, clientes e pedidos ficam no banco do back end; o navegador guarda só o carrinho e o cliente logado. Em uma aplicação real, as senhas seriam armazenadas com criptografia e o login usaria um token.

O endpoint `alterarSenha` do back end usa o campo `documento` do JSON como a senha antiga (é o que o `ClienteController` passa para o repositório), por isso o front envia a senha temporária nesse campo.

Pokémon e seus personagens são marcas registradas da Nintendo, Game Freak e The Pokémon Company. Este projeto não tem fins comerciais e foi feito apenas para fins de estudo.
