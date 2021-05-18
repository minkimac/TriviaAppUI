import { Component, OnInit } from '@angular/core';
import { TriviaViewModel } from 'src/app/models/trivia-view-model';
import { TriviaDataModel } from 'src/app/models/trivia-data-model';
import { TriviaApiService } from 'src/app/services/trivia-api.service';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent implements OnInit {
  triviaDataModel: Array<TriviaDataModel>;
  triviaViewModel: Array<TriviaViewModel>;
  _triviaApiService: TriviaApiService;

  constructor(triviaApiService: TriviaApiService) {
    this.triviaDataModel = [];
    this.triviaViewModel = [];
    this._triviaApiService = triviaApiService;
  }

  ngOnInit(): void {
    this.getTrivia();
  }

  getTrivia(){
    this._triviaApiService.getTrivia().subscribe(res =>{
      this.triviaDataModel = res;

      this.prepareTriviaViewData();
    },
    error =>{
      console.log(error);
    });
  }

  prepareTriviaViewData(){
    if(this.triviaDataModel){
      this.triviaDataModel.forEach(d => {
        let trivia = {
          category: d.category,
          difficulty: d.difficulty,
          type: d.type,
          question: d.question,
          answers: d.incorrect_answers,
          correctAnswer: d.correct_answer
        };
        trivia.answers.push(d.correct_answer);
        this.triviaViewModel.push(trivia);
      });
    }
  }
}
