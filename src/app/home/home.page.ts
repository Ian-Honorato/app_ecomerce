import { Component, inject, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Swiper } from 'swiper';
import { StoreService, Product } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  
  public folder!: string;
  private activedRoute = inject(ActivatedRoute);

  @ViewChild('swiper') swiperRef!: ElementRef;
  swiper?: Swiper;

  images = [
    'https://img.freepik.com/psd-premium/rotulo-para-campanha-de-marketing-no-brasil-3d-render-ofertas-da-semana-em-portugues_363450-1134.jpg?w=1380',
    'https://img.freepik.com/fotos-gratis/mulher-atraente-e-elegante-e-sorridente-escolhendo-roupas-em-loja-de-roupas_285396-4646.jpg?t=st=1727954998~exp=1727958598~hmac=c563f1d80daf8c0c2e4a0e8dca88579f9a860ade2e451191b7ff1283dad3dd9c&w=1060',
    'https://img.freepik.com/fotos-premium/uma-campanha-criativa-de-angariacao-de-fundos-com-mercadorias-personalizadas-como-camisetas-ou-pulseiras-personalizadas_1314467-119476.jpg?w=1380'
  ];

  isModalOpen = false;
  selectedSegment: 'custom' | 'segment' = 'custom';
  nome: string = '';
  celular: string = '';
  senha: string = '';
  celular_cadastrado: string = '';
  senha_cadastrado: string = '';
  usuario_logado: string = '';
  cartProduct: any = [];
  
  products: Product[] = []; // Adicionada variável para armazenar produtos

  // Injeção do StoreService
  constructor(private storeService: StoreService, private router: Router) {}

  swiperSlideChanged(e: any) {
    console.log('changed', e);
  }

  ngOnInit() {

    this.folder = this.activedRoute.snapshot.paramMap.get('id') as string;

    //verifica usuario logado
    const token = sessionStorage.getItem('token');
    if (token) {
      let usuarioLogado = JSON.parse(token);
      this.usuario_logado = usuarioLogado.nome;
    }

    // Busca os produtos ao inicializar a página Home
    this.storeService.getProductsByCategory('women\'s clothing', 3).subscribe((data: Product[]) => {
      this.products = data;
      console.log(this.products)
    });
  }

  ngAfterViewInit() {
    if (this.swiperRef) {
      this.swiper = new Swiper(this.swiperRef.nativeElement, {
        slidesPerView: 1,
        spaceBetween: 10,
        // Outras opções de configuração do Swiper
      });
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cartClick() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Usuário não está logado, exibindo modal.");
      this.setOpen(true);
    } else {
      console.log(this.cartProduct);
    }
  }

  cadastrar() {
    let usuario = new Usuario(this.nome, this.celular, this.senha);
    usuario.criarUsuario();
  }

  logar() {
    console.log('Tentando logar com celular: ' + this.celular_cadastrado);
    if (this.celular_cadastrado !== '' && this.senha_cadastrado !== '') {
      let senhaLogin = this.senha_cadastrado;
      let usuarioLogin = this.celular_cadastrado;
      let usuarios = this.buscarUsuarios();
      if (usuarios != null) {
        let usuarioEncontrado = false;
        usuarios.forEach((usuario: any) => {
          if (usuarioLogin === usuario.celular && senhaLogin === usuario.senha) {
            let nome = usuario.nome;
            let usuarioLogado = new Usuario(nome, usuario.celular, usuario.senha);
            usuarioLogado.loginUsuario();
            this.usuario_logado = nome;
            usuarioEncontrado = true;
            //console.log('Usuário encontrado e logado: ' + usuario.nome);
          }
        });
        if (!usuarioEncontrado) {
          console.log('Usuário ou senha incorretos');
        }
      } else {
        console.log('Nenhum usuário cadastrado');
      }
    } else {
      console.log('Campos de celular e senha não podem estar vazios');
    }
  }

  buscarUsuarios() {
    let usuarios = localStorage.getItem('usuario');
    if (usuarios) {
      return JSON.parse(usuarios);
    } else {
      return null;
    }
  }

  destroySession() {
    sessionStorage.removeItem('token');
    this.usuario_logado = '';
    this.setOpen(false);
  }
  //LISTA DE PRODUTOS E METODOS PARA ELE
  adicionarProduct(product:any ){
  
    this.cartProduct .push(
      {
        idProduto: product.id,
        precoProduto: product.price,
        nomeProduto: product.title,
        quantidade: 1,
        valorTotal:product.price
      }
    ) 

    console.log(this.cartProduct);  
    
  }
  aumentarQuantidade(index: number) {
    this.cartProduct[index].quantidade++;
    this.atualizaValor(index);
  }
  
  diminuirQuantidade(index: number) {
    if (this.cartProduct[index].quantidade > 1) {
      this.cartProduct[index].quantidade--;
      this.atualizaValor(index);
    } else {
      this.cartProduct.splice(index, 1); //remov o item
    }
  }
  atualizaValor(index: number) {
    if (this.cartProduct[index].quantidade >= 1) {
      this.cartProduct[index].valorTotal = (this.cartProduct[index].precoProduto * this.cartProduct[index].quantidade);
    }
  }
  finalizarCompra(pedidoFechado: any){
   console.log(pedidoFechado)
   
   this.setOpen(false);
   setTimeout( () => {
    this.enviaPedido(pedidoFechado);
   }) 
   
  }
  enviaPedido(pedidoFechado: any){
    this.router.navigate(['/finalizar-pedido'], { queryParams: { mensagem: JSON.stringify(pedidoFechado) } });
  }
}

// Classe Usuario
class Usuario {
  nome: string;
  celular: string;
  senha: string;

  constructor(nome: string, celular: string, senha: string) {
    this.nome = nome;
    this.celular = celular;
    this.senha = senha;
  }

  criarUsuario() {
    let usuariosCadastradosSTR = localStorage.getItem('usuario');
    let aux = [];

    if (usuariosCadastradosSTR) {
      aux = JSON.parse(usuariosCadastradosSTR);
    }

    let novoUsuario = {
      nome: this.nome,
      celular: this.celular,
      senha: this.senha
    };

    aux.push(novoUsuario);
    localStorage.setItem('usuario', JSON.stringify(aux));

    console.log('Usuário cadastrado com sucesso');
  }

  loginUsuario() {
    let verificaToken = sessionStorage.getItem('token');
    if (!verificaToken) {
      let token = { nome: this.nome, celular: this.celular };
      console.log('Usuário logado');
      sessionStorage.setItem('token', JSON.stringify(token));
    }
  }
}
