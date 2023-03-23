import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-root',
  providers: [Location, {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  title = 'TCPS';
  public PageTitle: string = '';
  private path: string = '';
  
  constructor(location: Location) {
    this.path = location.path();
    this.PageTitle = this.path == "" ? "Dashboard" : this.path.split('/')[1].toUpperCase();
  }
  
}
