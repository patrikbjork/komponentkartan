import { Component, OnChanges, Input, HostBinding, Output, EventEmitter, ElementRef, HostListener, OnInit } from '@angular/core';
import { PerfectScrollbarComponent, PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  DOWN_ARROW = 40,
  UP_ARROW = 38,
  ESCAPE = 27,
  SPACE = 13,
  ENTER = 32,
  TAB = 9
}

@Component({
  selector: 'vgr-search-result',
  templateUrl: './search-result.component.html'
})
export class SearchResultComponent implements OnChanges, OnInit {

  @Input() description: string;
  @Input() noResultsText = 'Inget resultat';
  @Input() items: any;
  @Input() maxItems = 25;
  displayItems: any;
  focusItem = -1;
  @Input() @HostBinding('class.search-results--open') visible = false;
  @Output() visibleChange = new EventEmitter();
  @Output() itemClick = new EventEmitter();
  scrollbarConfig: PerfectScrollbarConfig = new PerfectScrollbarConfig({ minScrollbarLength: 40 } as PerfectScrollbarConfigInterface);
  descriptionHeight: number;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    const target = event.target || event.srcElement || event.currentTarget;
    if (!this.elementRef.nativeElement.parentNode.contains(target) && this.visible) {
      this.visible = false;
      this.visibleChange.emit(this.visible);
      this.resetScrollPosition();
    }
  }

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    const parent = this.getParentNode();
    if (parent && parent.classList.contains('search-result-wrapper')) {
      parent.onkeydown = () => this.handleKeyevents(event);
    } else {
      throw new Error('Du har glömt att lägga din search-result komponent i en wrapper');
    }
  }

  ngOnChanges() {
    if (this.items) {
      this.filterItems();
      setTimeout(() => {
        if (this.elementRef.nativeElement.querySelector('.search-results__description')) {
          this.descriptionHeight = this.elementRef.nativeElement.querySelector('.search-results__description').offsetHeight;
        } else {
          this.descriptionHeight = 0;
        }
      }, 20);
    }
  }

  resetScrollPosition() {
    const psNode = this.elementRef.nativeElement.querySelector('div.ps');
    psNode.scrollTop = 0;
    this.focusItem = -1;
  }

  handleKeyevents(event) {
    if (!this.visible) {
      return;
    }

    this.setFocusedElement();

    if (event.keyCode === KEY_CODE.ESCAPE || event.keyCode === KEY_CODE.TAB) {
      this.visible = false;
      this.visibleChange.emit(this.visible);
      this.resetScrollPosition();
    } else if (event.keyCode === KEY_CODE.DOWN_ARROW || event.keyCode === KEY_CODE.UP_ARROW) {
      const nodes = this.elementRef.nativeElement.querySelectorAll('.search-results__items li');

      if (nodes.length === 0) {
        return;
      }

      if (event.keyCode === KEY_CODE.DOWN_ARROW) {
        if (this.focusItem === nodes.length - 1) {
          this.focusItem = 0;
        } else {
          this.focusItem++;
        }
      } else if (event.keyCode === KEY_CODE.UP_ARROW) {
        if (this.focusItem === 0 || this.focusItem === -1) {
          this.focusItem = nodes.length - 1;
        } else {
          this.focusItem--;
        }
      }
      const activeNode = nodes[this.focusItem];
      activeNode.focus();
      event.preventDefault();
      event.cancelBubble = true;
    } else if (event.keyCode === KEY_CODE.SPACE || event.keyCode === KEY_CODE.ENTER) {
      const target = event.target || event.srcElement || event.currentTarget;
      if (this.elementRef.nativeElement.contains(target)) {
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.onItemClick(this.displayItems[this.focusItem]);
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  indexInParent(node) {
    const children = node.parentNode.childNodes;
    let num = 0;
    for (let i = 0; i < children.length; i++) {
      if (children[i] === node) { return num; }
      if (children[i].nodeType === 1) { num++; }
    }
  }

  setFocusedElement() {
    const node = this.elementRef.nativeElement.querySelector('li:focus');
    this.focusItem = node ? this.indexInParent(node) : -1;
  }

  public getParentNode() {
    return this.elementRef.nativeElement.parentNode;
  }

  getHeight() {
    // 264px Is the size of the viewport that's available.
    return 264 + this.descriptionHeight;
  }

  filterItems() {
    this.displayItems = this.items.slice(0, this.maxItems);
  }

  onItemClick(item) {
    this.itemClick.emit(item);
  }

}
