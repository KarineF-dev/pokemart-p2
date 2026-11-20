package com.ads.lojinha;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido,Integer> {

    // adicionado para a PokéMart: tela "Meus pedidos" (mais recente primeiro)
    @Query(value = "select * from pedido where codigo_cliente=:codigoCliente order by codigo_pedido desc", nativeQuery = true)
    public List<Pedido> listarPorCliente(int codigoCliente);
}
