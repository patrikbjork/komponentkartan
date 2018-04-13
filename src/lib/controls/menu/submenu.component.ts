import { Input, Component, DoCheck, ElementRef, HostBinding, AfterViewInit, Renderer, forwardRef, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItemBase } from './menu-item-base';


@Component({
    selector: 'vgr-submenu',
    templateUrl: './submenu.component.html',
    providers: [{ provide: MenuItemBase, useExisting: forwardRef(() => SubmenuComponent) }]
})
export class SubmenuComponent extends MenuItemBase implements AfterViewInit {

    @Input() text: string;
    @Input() expanded: boolean;

    @HostBinding('class.submenu') hasClass = true;
    @HostBinding('class.submenu--expanded') get expandedClass() {
        return this.expanded;
    }
    @HostBinding('class.submenu--child-selected') private childSelected: boolean;

    @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
        if (event.keyCode === 13 || event.keyCode === 32) { // enter & space - navigera
            this.expanded = !this.expanded;
            if (this.expanded)
                this.goDown.emit();
            event.preventDefault();
        }

        if (event.keyCode === 40) { // Arrow Down
            console.log('submenu');
            this.goDown.emit();
            event.preventDefault();
        }
    }

    constructor(private router: Router, elementRef: ElementRef, renderer: Renderer) {
        super(elementRef, renderer);
    }

    setChildSelected() {
        this.childSelected = !!this.elementRef.nativeElement.querySelector('.menu__item--selected');
        if (this.childSelected) {
            this.expanded = true;
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.setChildSelected();

        }, 10);

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                setTimeout(() => {
                    this.setChildSelected();
                }, 100);
            }
        });
    }
}
