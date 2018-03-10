import { Component, OnInit, Input } from '@angular/core';
import { InstantMessagingService } from 'app/instant-messaging.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  private username = '';
  private password = '';

  @Input()
  errorLogin: string;

  constructor(private service: InstantMessagingService, private location: Location) { }

  private send(): void {
    this.service.sendLogin(this.username, this.password);
  }

  private goBack(): void {
    this.location.back();
  }
}

