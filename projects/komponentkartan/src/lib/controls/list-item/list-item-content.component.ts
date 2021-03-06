import { Component, HostBinding, Input, Output, EventEmitter, HostListener, ElementRef, Renderer } from '@angular/core';

@Component({
    selector: 'vgr-list-item-content',
    template: `<ng-content></ng-content>`
})

export class ListItemContentComponent {
    @Output() goUp: EventEmitter<any> = new EventEmitter();
    @Output() goDown: EventEmitter<any> = new EventEmitter();
    @HostBinding('class.list-item__content') listItemContent = true;
    @HostBinding('class.list-item__content--indent') get addPaddingClass() { return this.indentContent; }

    @Input() indentContent = true;

    @HostListener('keydown', ['$event'])
    toggleExpand(event: KeyboardEvent) {
        if (event.ctrlKey && event.keyCode === 33) { // Ctrl + PageUp
            this.goUp.emit();
            event.preventDefault();
        }
        if (event.ctrlKey && event.keyCode === 34) { // Ctrl + PageDown
            this.goDown.emit();
            event.preventDefault();
        }
    }

    constructor(private elementRef: ElementRef, private renderer: Renderer) {
    }

    setFocus() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus');
    }
}
