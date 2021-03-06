import { Component, EventEmitter, HostBinding, Output, Input, forwardRef } from '@angular/core';

import { ListColumnHeaderComponent } from './list-column-header.component';
import { ListColumnComponent } from './list-column.component';

@Component({
    templateUrl: './list-column-checkbox.component.html',
    selector: 'vgr-list-column-checkbox',
    providers: [{
        provide: ListColumnComponent,
        useExisting: forwardRef(() => ListColumnCheckboxComponent)
    }]
})
export class ListColumnCheckboxComponent extends ListColumnComponent {
    @HostBinding('class.list__column--checkbox') listColumnCheckboxClass = true;
    @Output() checkedChanged = new EventEmitter<boolean>();
    @Input() checked = false;
    @Input() disabled = false;

    onItemCheckChanged(event: boolean) {
        this.checked = event;
        this.checkedChanged.emit(this.checked);
    }
}

