import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SpeechRecognitionModule } from 'lib/speech-recognition';
import { ApiService } from './api.service';
import { AppComponent } from './app.component';
import { DialogueComponent } from './components/dialogue/dialogue.component';


@NgModule({
  declarations: [
    AppComponent,
    DialogueComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpModule,
    SpeechRecognitionModule.withConfig({
      lang: 'ja',

      interimResults: true,
      maxAlternatives: 10,



      // sample handlers.
      //onaudiostart:  (ev: Event)                  => console.log('onaudiostart',  ev),
      //onsoundstart:  (ev: Event)                  => console.log('onsoundstart',  ev),
      //onspeechstart: (ev: Event)                  => console.log('onspeechstart', ev),
      //onspeechend:   (ev: Event)                  => console.log('onspeechend',   ev),
      //onsoundend:    (ev: Event)                  => console.log('onsoundend',    ev),
      //onaudioend:    (ev: Event)                  => console.log('onaudioend',    ev),
      //onresult:      (ev: SpeechRecognitionEvent) => console.log('onresult',      ev),
      //onnomatch:     (ev: SpeechRecognitionEvent) => console.log('onnomatch',     ev),
      //onerror:       (ev: SpeechRecognitionError) => console.log('onerror',       ev),
      //onstart:       (ev: Event)                  => console.log('onstart',       ev),
      //onend:         (ev: Event)                  => console.log('onend',         ev),
    }),

  ],
  providers: [
  AppComponent,
  ApiService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
