import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { MatIconModule} from '@angular/material/icon';
import { MatMenuModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { MessageListComponent } from './message-list/message-list.component';
import { InstantMessageComponent } from './instant-message/instant-message.component';
import { NewMessageFormComponent } from './new-message-form/new-message-form.component';
import { InstantMessagingService } from './instant-messaging.service';
import { RoutingService } from './routing.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { AutoScrollDirective } from './auto-scroll.directive';
import { ConnectedPeopleListComponent } from './connected-people-list/connected-people-list.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatComponent } from './chat/chat.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SubscribeFormComponent } from './subscribe-form/subscribe-form.component';
import { ProfilComponent } from './profil/profil.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageListComponent,
    InstantMessageComponent,
    NewMessageFormComponent,
    LoginFormComponent,
    AutoScrollDirective,
    ConnectedPeopleListComponent,
    ChatComponent,
    WelcomeComponent,
    SubscribeFormComponent,
    ProfilComponent
    ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
  ],
  entryComponents: [
    ProfilComponent
  ],
  providers: [
    InstantMessagingService,
    RoutingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
