import { Component } from '@angular/core';
import { InstantMessagingService } from 'app/instant-messaging.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-subscribe-form',
  templateUrl: './subscribe-form.component.html',
  styleUrls: ['./subscribe-form.component.css']
})
export class SubscribeFormComponent {

  private username = '';
  private password = '';
  private mail = '';

  constructor(private service: InstantMessagingService, private location: Location) { }

  private send(): void {
    this.service.sendSubscription(this.username, this.password, this.mail);
  }

  private goBack(): void {
    this.location.back();
  }
}
