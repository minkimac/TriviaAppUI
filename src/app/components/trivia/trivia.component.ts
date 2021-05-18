import { Component, OnInit } from '@angular/core';
import { Options, TriviaViewModel } from '../../models/trivia-view-model';
import { TriviaDataModel } from '../../models/trivia-data-model';
import { TriviaApiService } from '../../services/trivia-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent implements OnInit {
  triviaDataModel: Array<TriviaDataModel>;
  triviaViewModel: Array<TriviaViewModel>;
  incorrectSelections: TriviaViewModel[];
  correctSelections: TriviaViewModel[];
  triviaSubmitted: boolean;
  errors: string[];

  constructor(private triviaApiService: TriviaApiService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.triviaDataModel = [];
    this.triviaViewModel = [];
    this.incorrectSelections = [];
    this.correctSelections = [];
    this.errors = [];
    this.triviaSubmitted = false;
  }

  async ngOnInit(){
    await this.getTrivia();
  }

  async getTrivia(){
    await this.triviaApiService.getTrivia().subscribe(async res =>{
      this.triviaDataModel = res;

      await this.prepareTriviaViewData();
      await this.randomiseTrivia();
    },
    error =>{
      console.log(error);
    });
  }

  async prepareTriviaViewData(){
    if(this.triviaDataModel){
      this.triviaDataModel.forEach((q,qIndex) => {
        let questionId = qIndex+1;
        let options: Options[]=[];
        q.incorrect_answers.forEach((a,aIndex) =>{
          options.push({
            optionId: (Number)(questionId.toString() + aIndex.toString()),
            option: a
          })
        });
        options.push({
          optionId: (options[options.length-1].optionId) + 1,
          option: q.correct_answer
        });

        let trivia: TriviaViewModel = {
          questionId: questionId,
          category: q.category,
          difficulty: q.difficulty,
          type: q.type,
          question: q.question,
          options: options,
          correctOptionId: options.find(o => o.option == q.correct_answer)?.optionId ?? 0,
          selectedOptionId: 0
        };
        this.triviaViewModel.push(trivia);
      });
    }
  }

  async randomiseTrivia(){
    this.triviaViewModel = this.triviaViewModel.sort(() => Math.random() - 0.5);
    this.triviaViewModel.forEach(t => t.options = t.options.sort(() => Math.random() - 0.5));
  }

  onSubmit(){
    this.errors=[];
    if(!this.validateForm())
      return;
    this.triviaSubmitted = true;
    this.incorrectSelections = this.triviaViewModel.filter(t => t.selectedOptionId != t.correctOptionId);
    this.correctSelections = this.triviaViewModel.filter(t => t.selectedOptionId == t.correctOptionId);
  }

  validateForm(){
    if(!this.triviaViewModel.every(t => t.selectedOptionId > 0)){
      this.errors.push('All questions are mandatory')
      return false;
    }
    else{
      this.errors = [];
      return true;
    }
  }

  onOptionSelected(questionId:number, optionId:number){
    (this.triviaViewModel.find(t => t.questionId === questionId) as TriviaViewModel).selectedOptionId = optionId;
  }

  getCorrectOption(questionId: number, correctOptionId: number){
    return ((this.triviaViewModel.find(t=>t.questionId == questionId) as TriviaViewModel).options.find(o => o.optionId == correctOptionId) as Options).option;
  }

  onRetakeClick(){
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
  }
}
