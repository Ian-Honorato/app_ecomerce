import { Injectable } from '@angular/core'; // Removido o segundo import repetido
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = 'https://fakestoreapi.com'; // URL da API

  constructor(private http: HttpClient) {}

  // Método para obter todos os produtos
  getProductsByCategory(category: string, limit: number = 4): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}?limit=${limit}`);
  }

  // Método para obter um produto pelo ID
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}

// Definição da interface Product
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string; 
}
