import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = 'http://localhost:8080/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  crearUsuario(usuario: any) {
    console.log(usuario);
    return this.http.post<any>(this.url + 'usuarios', usuario).subscribe(data => {
      console.log(data);
    });
  }

}
