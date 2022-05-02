import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../Models/types'; 

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  selectedProducto?: Producto;

  private url = 'http://localhost:8080/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  getProductos() {
    return this.http.get<Producto[]>(this.url + 'productos');
  }

  getProductosPorBusqueda(busqueda: string) {
    return this.http.get<Producto[]>(this.url + 'productos/busqueda/' + busqueda);
  }

  
  // /** GET productos desde el servidor */
  // getProductos(): Observable<Producto[]> {
  //   return this.http.get<Producto[]>(this.productosUrl).pipe(
  //     tap(_ => this.log('fetched productos')),
  //     catchError(this.handleError<Producto[]>('getProductos', []))
  //   );
  // }

  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  *
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {

  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     this.log(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }

  //   /** Log a HeroService message with the MessageService */
  // private log(message: string) {
  //   this.messageService.add(`HeroService: ${message}`);
  // }
}
