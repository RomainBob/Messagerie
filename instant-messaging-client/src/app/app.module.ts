import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MessageListComponent } from './message-list/message-list.component';
import { InstantMessageComponent } from './instant-message/instant-message.component';
import { NewMessageFormComponent } from './new-message-form/new-message-form.component';
import { InstantMessagingService } from './instant-messaging.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { AutoScrollDirective } from './auto-scroll.directive';
import { ConnectedPeopleListComponent } from './connected-people-list/connected-people-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageListComponent,
    InstantMessageComponent,
    NewMessageFormComponent,
    LoginFormComponent,
    AutoScrollDirective,
    ConnectedPeopleListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [InstantMessagingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
