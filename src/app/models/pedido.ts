import { ItemPedido } from './item-pedido';

export class Pedido {
  codigoPedido: number = 0;
  codigoCliente: number = 0;
  valorTotal: number = 0;
  entrega: string = '';
  pagamento: string = '';
  obs: string = '';
  dataPedido: string = '';
  itens: ItemPedido[] = [];
}
