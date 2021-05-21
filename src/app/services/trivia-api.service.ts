import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TriviaDataModel } from '../models/trivia-data-model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriviaApiService {

  // private TRIVIA_API_BASE_URL = "https://localhost:44337";
  private TRIVIA_API_BASE_URL = "https://api-trivia.azurewebsites.net";

  constructor(private httpClient: HttpClient) { }

  getTrivia():Observable<TriviaDataModel[]>{

    let endpointPath = "/api/trivia";
    let url = this.TRIVIA_API_BASE_URL + endpointPath;

    return this.httpClient.get<TriviaDataModel[]>(url);

  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`Trivia Service: ${message}`);
  }
}
