import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.css']
})
export class ToggleButtonComponent implements OnInit {
  active = false;
  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.active = !this.active;
  }

}
