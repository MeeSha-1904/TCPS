import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  CurrentDT = new Date().toLocaleString('en-IN');

  ngOnInit() {
    setInterval(() => {
      this.CurrentDT = new Date().toLocaleString('en-IN');
    }, 1000);
  }
}
