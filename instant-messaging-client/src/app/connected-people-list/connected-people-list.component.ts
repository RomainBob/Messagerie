import { Component, Input } from '@angular/core';
import { InstantMessagingService } from '../instant-messaging.service';

@Component({
  selector: 'app-connected-people-list',
  templateUrl: './connected-people-list.component.html',
  styleUrls: ['./connected-people-list.component.css']
})
export class ConnectedPeopleListComponent {
  //@Input()
  //user: string;

  constructor(private service: InstantMessagingService) { }

}
