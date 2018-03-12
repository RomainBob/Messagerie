import { InstantMessage } from './instant-message';

export class Discussion {
    constructor(public id:  number, public users: string[], public content: InstantMessage[] ) { }
  }
