import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finalizar-pedido',
  templateUrl: './finalizar-pedido.page.html',
  styleUrls: ['./finalizar-pedido.page.scss'],
})
export class FinalizarPedidoPage implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  
  pedidoFechado:any;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pedidoFechado = JSON.parse(params['mensagem']);
      console.log(this.pedidoFechado);
    })

  }
  finalizarPedido(pedido:any){
    //console.log(pedido);
    
      const dadosParaSalvar = {
        dadosPedido: pedido
      };
    
      // Serializa o objeto e armazena no localStorage
      localStorage.setItem('dadosPedido', JSON.stringify(dadosParaSalvar));
      this.cancelarPedido();
  }
  cancelarPedido(){
    this.pedidoFechado = [''];
    console.log(this.pedidoFechado);
    this.router.navigate(['/home']);
  }
}