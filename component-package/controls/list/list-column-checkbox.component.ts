import { Component, EventEmitter, HostBinding, Output, Input } from '@angular/core';

import { ListColumnHeaderComponent } from './list-column-header.component';
import { ListColumnComponent } from './list-column.component';

@Component({
    templateUrl: './list-column-checkbox.component.html',
    moduleId: module.id,
    selector: 'vgr-list-column-checkbox'
})
export class ListColumnCheckboxComponent extends ListColumnComponent {
    @HostBinding('class.list__column--checkbox') listColumnCheckboxClass = true;
    @Output() check = new EventEmitter();
    @Input() checked = false;
    @Input() disabled = false;

    onItemCheckChanged() {
        // e.cancelBubble = true;
        this.check.emit();
    }
}

