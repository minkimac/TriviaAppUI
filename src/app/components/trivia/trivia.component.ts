import { Component, OnInit } from '@angular/core';
import { Trivia } from '../../models/trivia';
import { TriviaApiService } from '../../services/trivia-api.service';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent implements OnInit {
  trivia: Array<Trivia>;
  _triviaApiService: TriviaApiService;

  constructor(triviaApiService: TriviaApiService) {
    this.trivia = [];
    this._triviaApiService = triviaApiService;
  }

  ngOnInit(): void {
    this.getTrivia();
  }

  getTrivia(){
    this._triviaApiService.getTrivia().subscribe(res =>{
      this.trivia = res;
    },
    error =>{
      console.log(error);
    });
  }

}
