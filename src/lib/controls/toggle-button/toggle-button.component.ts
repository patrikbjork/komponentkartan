import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vgr-toggle-button',
  templateUrl: './toggle-button.component.html'
})
export class ToggleButtonComponent implements OnInit {
  @Input() disabled = false;
  @Input() pressed = false;
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  tabindex = 0;

  ngOnInit() {
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'Left' || event.key === 'ArrowUp' || event.key === 'Up') {
      this.previous.emit();
    } else if (event.key === 'ArrowRight' || event.key === 'Right' || event.key === 'ArrowDown' || event.key === 'Down') {
      this.next.emit();
    }
  }

  checkDisabled(event: MouseEvent) {
    if (this.disabled) {
      event.stopPropagation();
    }
  }

}
