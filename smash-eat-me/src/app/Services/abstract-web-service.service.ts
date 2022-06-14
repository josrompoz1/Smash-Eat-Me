import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AbstractWebService {

  constructor(private http: HttpClient) { }

  private getHeaders(): Promise<HttpHeaders> {
    return new Promise((resolve) => {
      let headers = new HttpHeaders().set('Accept', 'application/json')
      resolve(headers);
    })
  }

  protected makeGetRequest(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(path).subscribe(response => {
        resolve(response);
      }, error => {
        console.log(error)
        reject(error);
      })
    })
  }

  protected makePostRequest(path: string, data: any): Promise<any> {
    return this.getHeaders().then((headers) => {
      return new Promise((resolve, reject) => {
        this.http.post(path, data, {headers: headers}).subscribe(response => {
          resolve(response);
        }, error => {
          console.log(error)
          reject(error);
        })
      })
    })
  }

}
