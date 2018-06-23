import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiService } from '../../api.service';
import { tts } from '../../../assets/javascript/tts'

import {
  SpeechRecognitionService,
  SpeechRecognitionLang,
  SpeechRecognitionMaxAlternatives,
  SpeechRecognitionGrammars,
  SpeechRecognitionSoundendHandler,
  SpeechRecognitionContinuous,
  SpeechRecognitionSpeechendHandler,
} from 'lib/speech-recognition';

import {
  ColorGrammar,
} from './dialogue.component.grammar';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css'],
  providers: [
    {
      provide: SpeechRecognitionLang,
      useValue: 'en-US',
    },
    {
      provide: SpeechRecognitionMaxAlternatives,
      useValue: 1,
    },
    {
      provide: SpeechRecognitionGrammars,
      useValue: ColorGrammar,
    },
    SpeechRecognitionService,
  ],
})

export class DialogueComponent implements OnInit {
  recording = false;
  instantRestart = true;
  suggestionSelected = false;
  userId: number;

  messages = [];
  responses = [];
  suggestions = [];

  recordButtonText = "Press to start recording";

  selectedSuggestion = new Suggestion("Stand-in", ["Stand-in", "Stand-in"], "Stand-in", 0);
  stage: string = "persons";
  amount: number = 1;
  amountPersons: number = 1;
  amountNights: number = 1;

  constructor(private service: SpeechRecognitionService, private api: ApiService) {

    this.service.onresult = (e) => { //process the user input when the input is considered final
      if(e.results[0].isFinal){
        this.AddMessage(e.results[0].item(0).transcript);
      }
    };

    this.service.onend = (e) => {
      this.recording = false;
      if(this.instantRestart){
        this.StartRecording();
      }
    }

    this.service.onstart = (e) => {
      this.instantRestart = true;
      this.recording = true;
    }
  }

  ngOnInit(){
    this.userId = Math.floor(Math.random()*(1000-1+1)+1); //replace with proper way of generating user/session id
    this.GetResponse("Hello");
  }

  AddMessage(message: string){ //if message isnt empty, add message to the messages list and send to the api
    if(message == ''){
      return;
    }
    this.messages.push(message);
    if(!this.suggestionSelected){ //if no suggestion is selected, call on API
      if(this.suggestions.length == 1){
        let lowercaseMessage = message.toLowerCase();
        let acceptKeywords = ["view", "yes", "fine", "good", "nice"];
        for(var keyword in acceptKeywords){
          if(lowercaseMessage.includes(acceptKeywords[keyword])){
            this.ShowSuggestionDetails(this.suggestions[0]);
            return;
          }
        }
      }
      else{
        this.GetResponse(message);
      }
    } else { //else, handle user input directly
      this.HandleUserInput(message);
    }
  }

  GetResponse(message: string){ //send message to api and handleresponse as json
    this.api.SendInput(this.userId, message)
    .subscribe(response => this.HandleResponse(response.json()));
  }

  HandleTextInput(){
    let input = <HTMLInputElement>document.getElementById("input");
    this.AddMessage(input.value);
    input.value = '';
  }

  HandleResponse(data: any){ //add response to responses list and if suggestions are made, add those to the suggestion list
    if(data.response != ""){
      this.responses.push(data.response);
      tts(data.response);
    }
    if(data.suggestions != null){
      this.suggestions = [];
      data.suggestions.forEach(suggestion => {
        let newSuggestion = new Suggestion(suggestion.name, suggestion.images, suggestion.activities, suggestion.price);
        this.suggestions.push(newSuggestion);
      });
    }
  }

  HandleUserInput(message: string){ //handle the user input when suggestion details are opened
    let refuseKeywords = ["no", "refuse", "reject", "other"];
    let numberKeywords = ["one", "two", "three", "four", "five", "six", "seven", "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "1", "2", "3", "4", "5", "6", "7"];
    let lowercaseMessage = message.toLowerCase();
    for(var keyword in refuseKeywords){
      if(lowercaseMessage.includes(refuseKeywords[keyword])){
        this.HideSuggestionDetails();
        let response = "You rejected the suggestion. Please select another suggestion or refresh the page to start over";
        this.responses.push(response);
        tts(response);
        return;
      }
    }
    if(this.stage != "checkout"){
      for(var keyword in numberKeywords){
        if(lowercaseMessage.includes(numberKeywords[keyword])){
          switch(numberKeywords[keyword]){
            case "one":
            case "1":
            case "een":
              this.amount = 1;
              break;
            case "two":
            case "2":
            case "twee":
              this.amount = 2;
              break;
            case "three":
            case "3":
            case "drie":
              this.amount = 3;
              break;
            case "four":
            case "4":
            case "vier":
              this.amount = 4;
              break;
            case "five":
            case "5":
            case "vijf":
              this.amount = 5;
              break;
            case "six":
            case "6":
            case "zes":
              this.amount = 6;
              break;
            case "seven":
            case "7":
            case "zeven":
              this.amount = 7;
              break;
          }
          let response = "";
          if(this.stage == "persons"){
            response = ("You want to book for " + this.amount + " " + this.stage + ". How many nights would you like to stay?");
            this.amountPersons = this.amount;
            this.stage = "nights";
          } else if(this.stage == "nights"){
            response = ("You want to book for " + this.amount + " " + this.stage + ". Please proceed to checkout if you are satisfied. if not, you can reject the suggestion");
            this.amountNights = this.amount;
            this.stage = "checkout";
          }
          this.responses.push(response);
          tts(response);
          return;
        }
      }
    }

    let response = "I do not understand. Please give me a number (below 8)";
    if(this.stage == "checkout"){
      response = "Please proceed to checkout if you are satisfied. if not, you can reject the suggestion";
    }
    this.responses.push(response);
    tts(response);
  }

  ShowSuggestionDetails(suggestion : Suggestion) {//open the card with suggestion details and start the dialogue
    this.stage = "persons";
    this.selectedSuggestion = suggestion;
    let div1 = document.getElementById('suggestion-details');
    if (div1.style.display == "none") {
        div1.style.display = "block";
    }
    let div2 = document.getElementById('cards');
    if (div2.style.display == "block") {
        div2.style.display = "none";
    }
    this.suggestionSelected = true;
    let response = "With how many persons will you be staying?";
    this.responses.push(response);
    tts(response);
  }

  HideSuggestionDetails() {//hide the card with suggestion details
    let div1 = document.getElementById('suggestion-details');
    if (div1.style.display == "block") {
        div1.style.display = "none";
    }
    let div2 = document.getElementById('cards');
    if (div2.style.display == "none") {
        div2.style.display = "block";
    }
    this.suggestionSelected = false;
    if(this.stage == "persons"){
      tts(this.responses[this.responses.length-2]);
      this.responses.push(this.responses[this.responses.length-2]);
    } else if(this.stage == "nights"){
      tts(this.responses[this.responses.length-3]);
      this.responses.push(this.responses[this.responses.length-3]);
    } else {
      tts(this.responses[this.responses.length-4]);
      this.responses.push(this.responses[this.responses.length-4]);
    }
    
  }

  StartRecording(){ //start recording
    this.service.start();
    this.recordButtonText = "Press to stop recording";
  }

  StopRecording(){ //stop recording
    this.instantRestart = false;
    this.service.stop();
    this.recordButtonText = "Press to start recording"
  }

  SetRecording(mode: boolean){ //swap recording mode
    if(mode == true){
      this.StopRecording();
    }
    else{
      this.StartRecording();
    }
  }
}

class Suggestion {
  name: string;
  images: string[];
  activities: string;
  price: number;

  constructor(name: string, images: string[], activities: string, price: number){
    this.name = name;
    this.images = images;
    this.activities = activities;
    this.price = price;
  }
}
