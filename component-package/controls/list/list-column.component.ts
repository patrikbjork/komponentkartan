import { Component, HostBinding, Input, Output, EventEmitter, DoCheck } from '@angular/core';

import { ListColumnHeaderComponent } from './list-column-header.component';

@Component({
    templateUrl: './list-column.component.html',
    moduleId: module.id,
    selector: 'vgr-list-column'
})
export class ListColumnComponent implements DoCheck {
    @HostBinding('class', )
    get classes(): string {
        return 'list__column flex-column ' + this.getColumnWidthClass() + ' ' + this.getAlignClass();
    }
    @Input() text: string;

    width: number;
    align: string;
    pendingWidth: number;
    pendingAlign: string;
    private getColumnWidthClass(): string {
        return 'flex-column--' + (this.width ? this.width : 1);
    }

    private getAlignClass(): string {
        return 'column--align-' + (this.align ? this.align : "left");
    }

    ngDoCheck() {
        // För att undvika att man får Expression Changed after it was checked, sätts width här
        // Notera att DoCheck åsidosätter den normala ChangeDetection som görs.
        // Om denna komponent får mer beteende och state i framtiden kan lösningen behöva göras om.
        // Om värdet på text ändras slår det igenom, så sådan ChangeDetection är intakt.
        if (this.pendingWidth !== this.width) {
            this.width = this.pendingWidth;
        }

        if (this.pendingAlign !== this.align) {
            this.align = this.pendingAlign;
        }
    }

    setWidth(width: number) {
        // För att undvika att man får Expression Changed after it was checked, lagras värdet undan som "pending".
        // Det sätts sedan i DoCheck
        this.pendingWidth = width;
    }
    setAlignment(alignment: string) {
        // För att undvika att man får Expression Changed after it was checked, lagras värdet undan som "pending".
        // Det sätts sedan i DoCheck
        this.pendingAlign = alignment;
    }
}

