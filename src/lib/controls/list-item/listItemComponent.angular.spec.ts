
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement, Renderer, ElementRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowNotification } from '../../models/rowNotification.model';
import { NotificationIcon } from '../../models/notificationIcon.model';
import { NotificationType } from '../../models/notificationType.model';

import {
  ListItemComponent, ListItemHeaderComponent, ListColumnComponent,
  ListItemContentComponent, ListItemJqeuryHelper
} from '../../index';

@Component({
  selector: 'test',
  template: `
          <vgr-list-item>
            <vgr-list-item-header>
            </vgr-list-item-header>
            <vgr-list-item-content>
              <span> Mer information</span>
            </vgr-list-item-content>
          </vgr-list-item>
          `
})
class TestListItemComponent { }

describe('ContentProjectionComponent', () => {
  let component: ListItemComponent;
  let testListItemComponentFixture: ComponentFixture<TestListItemComponent>;
  let listItemComponentFixture: ComponentFixture<ListItemComponent>;
  let rootElement: DebugElement;

  beforeEach(done => (async () => {
    TestBed.configureTestingModule({
      declarations: [TestListItemComponent,
        ListItemComponent,
        ListItemHeaderComponent,
        ListItemContentComponent
      ],
      imports: [CommonModule, BrowserAnimationsModule, BrowserDynamicTestingModule],
      providers: [
        { provide: ElementRef },
        { provide: Renderer }]
    });
    await TestBed.compileComponents();

    TestBed.compileComponents().then(() => {
      testListItemComponentFixture = TestBed.createComponent(TestListItemComponent);
      listItemComponentFixture = TestBed.createComponent(ListItemComponent);
      listItemComponentFixture.componentInstance.listItemHeader = <ListItemHeaderComponent>testListItemComponentFixture.debugElement.query(By.directive(ListItemHeaderComponent)).componentInstance; // First element in list-item which is list-item-header;
      listItemComponentFixture.componentInstance.listContent = <ListItemContentComponent>testListItemComponentFixture.debugElement.query(By.directive(ListItemContentComponent)).componentInstance;  // Second element in list-item which is list-item-content;
      component = listItemComponentFixture.componentInstance;
      rootElement = listItemComponentFixture.debugElement;
      component.ngAfterContentInit();

      testListItemComponentFixture.detectChanges();
      listItemComponentFixture.detectChanges();
    });

  })().then(done).catch(done.fail));


  describe('When initialized', () => {
    let element: DebugElement

    it('the component has the list-item class', () => {
      expect(rootElement.classes['list-item']).toBe(true);
    });

    it('the component is collapsed', () => {
      expect(rootElement.classes['list-item--collapsed']).toBe(true);
    })

    it('the component is expanded', () => {
      expect(rootElement.classes['list-item--expanded']).toBe(false);
    })

    describe('and the list-item-header is clicked', () => {
      const event: any = { cancelBubble: false };

      beforeEach(() => {
        console.log(component.expanded);
        spyOn(component, 'toggleExpand').and.callThrough();
        component.notInteractable = false;
        component.isDeleted = false;

        element = rootElement.query(By.css('.list-item__header_wrapper'));
        element.triggerEventHandler('click', event);
        listItemComponentFixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });
      it('toggleExpand has been called once', () => {
        expect(component.toggleExpand).toHaveBeenCalledTimes(1);
      });
      it('the component is not collapsed', () => {
        expect(rootElement.classes['list-item--collapsed']).toBe(false);
      });
      it('component is expanded', () => {
        expect(rootElement.classes['list-item--expanded']).toBe(true);
      });
      it('click event is not bubbled', () => {
        expect(event.cancelBubble).toBeTruthy();
      });
    });

    describe('and the header is clicked again', () => {
      beforeEach(() => {
        spyOn(component, 'toggleExpand').and.callThrough();
        element = rootElement.query(By.css('.list-item__header_wrapper'));
        element.triggerEventHandler('click', event);
        listItemComponentFixture.detectChanges();
      });
      it('the component is collapsed', () => {
        expect(rootElement.classes['list-item--collapsed']).toBe(true);
      });
      it('component is not expanded', () => {
        expect(rootElement.classes['list-item--expanded']).toBe(false);
      });
      it('toggleExpand has been called once again', () => {
        expect(component.toggleExpand).toHaveBeenCalled();
      });
    });

    describe('and the list-item-header is in focus', () => {
      let header: DebugElement;
      beforeEach(() => {
        header = testListItemComponentFixture.debugElement.query(By.directive(ListItemHeaderComponent)); // First element in list-item which is list-item-header;

        spyOn(component.listItemHeader.expandedChanged, 'emit').and.callThrough();
        spyOn(component.listItemHeader.goToFirst, 'emit').and.callThrough();
        spyOn(component.listItemHeader.goToLast, 'emit').and.callThrough();
        spyOn(component.listItemHeader.goUp, 'emit').and.callThrough();
        spyOn(component.listItemHeader.goDown, 'emit').and.callThrough();

        spyOn(component.setFocusOnFirstRow, 'emit');
        spyOn(component.setFocusOnLastRow, 'emit');
        spyOn(component.setFocusOnPreviousRow, 'emit');
        spyOn(component.setFocusOnNextRow, 'emit');
        spyOn(component.setFocusOnPreviousRowContent, 'emit');
        spyOn(component.setFocusOnNextRowContent, 'emit');

        spyOn(component, 'setExpandOrCollapsed');
        spyOn(listItemComponentFixture.componentInstance.listItemHeader, 'toggleExpand').and.callThrough();

        component.ngAfterContentInit();
        listItemComponentFixture.detectChanges();
        console.log(component.expanded);
      });

      describe('and the header is pressed with space', () => {
        beforeEach(() => {
          component.expanded = false;
          header.triggerEventHandler('keydown', { keyCode: 32 } as KeyboardEvent);
          listItemComponentFixture.detectChanges();
          console.log(component.expanded); //buggit som fan
        });

        it('expandedChanged event has been emitted', () => {
          expect(component.listItemHeader.expandedChanged.emit).toHaveBeenCalledWith(true);
        });

        it('listItemHeaderComponent listItemHeader toggleExpand has been called', () => {
          expect(listItemComponentFixture.componentInstance.listItemHeader.toggleExpand).toHaveBeenCalled();
        });

        it('component is expanded', () => {
          console.log(component.expanded);
          expect(rootElement.classes['list-item--expanded']).toBe(true);
        });

        it('the component is not collapsed', () => {
          console.log(component.expanded);
          expect(rootElement.classes['list-item--collapsed']).toBe(false);
        });
      });

      describe('and the header is pressed with enter', () => {
        beforeEach(() => {
          header.triggerEventHandler('keydown', { keyCode: 13 } as KeyboardEvent);
        });

        it('expandedChanged event has been emitted', () => {
          expect(component.listItemHeader.expandedChanged.emit).toHaveBeenCalledWith(true);
        });

        it('component is expanded', () => {
          expect(component.expanded).toBe(true);
        });
      });

      describe('and the header is pressed with Home key', () => {
        beforeEach(() => {
          header.triggerEventHandler('keydown', { keyCode: 36 } as KeyboardEvent);
        });

        it('goToFirst event has been emitted', () => {
          expect(component.listItemHeader.goToFirst.emit).toHaveBeenCalled();
        });

        it('setFocusOnFirstRow event is emitted', () => {
          expect(component.setFocusOnFirstRow.emit).toHaveBeenCalled();
        });
      });

      describe('and the header is pressed with End key', () => {
        beforeEach(() => {
          header.triggerEventHandler('keydown', { keyCode: 35 } as KeyboardEvent);
        });

        it('goToLast event has been emitted', () => {
          expect(component.listItemHeader.goToLast.emit).toHaveBeenCalled();
        });

        it('setFocusOnLastRow event is emitted', () => {
          expect(component.setFocusOnLastRow.emit).toHaveBeenCalled();
        });
      });

      describe('and the header is pressed with Ctrl + PageUp', () => {
        beforeEach(() => {
          header.triggerEventHandler('keydown', { ctrlKey: true, keyCode: 33 } as KeyboardEvent);
        });

        it('goToLast event has been emitted', () => {
          expect(component.listItemHeader.goUp.emit).toHaveBeenCalled();
        });

        it('setFocusOnPreviousRow event is emitted', () => {
          expect(component.setFocusOnPreviousRow.emit).toHaveBeenCalled();
        });
      });

      describe('and the header is pressed with Ctrl + PageDown', () => {
        beforeEach(() => {
          header.triggerEventHandler('keydown', { ctrlKey: true, keyCode: 34 } as KeyboardEvent);
        });

        it('goToLast event has been emitted', () => {
          expect(component.listItemHeader.goDown.emit).toHaveBeenCalled();
        });

        it('setFocusOnNextRow event is emitted', () => {
          expect(component.setFocusOnNextRow.emit).toHaveBeenCalled();
        });
      });

      describe('and the header is pressed with Arrow Up', () => {
        beforeEach(() => {
          header.triggerEventHandler('keydown', { keyCode: 38 } as KeyboardEvent);
        });

        it('goToLast event has been emitted', () => {
          expect(component.listItemHeader.goUp.emit).toHaveBeenCalled();
        });

        it('setFocusOnPreviousRow event is emitted', () => {
          expect(component.setFocusOnPreviousRow.emit).toHaveBeenCalled();
        });
      });

      describe('and the header is pressed with Arrow Down', () => {
        beforeEach(() => {
          header.triggerEventHandler('keydown', { keyCode: 40 } as KeyboardEvent);
        });

        it('goToLast event has been emitted', () => {
          expect(component.listItemHeader.goDown.emit).toHaveBeenCalled();
        });

        it('setFocusOnNextRow event is emitted', () => {
          expect(component.setFocusOnNextRow.emit).toHaveBeenCalled();
        });
      });
    });

    describe('and the list-item-content is in focus', () => {
      let content: DebugElement;

      beforeEach(() => {
        content = testListItemComponentFixture.debugElement.query(By.directive(ListItemContentComponent)); // First element in list-item which is list-item-header;

        spyOn(component.listContent.goUp, 'emit').and.callThrough();
        spyOn(component.listContent.goDown, 'emit').and.callThrough();
        spyOn(component.setFocusOnPreviousRowContent, 'emit');
        spyOn(component.setFocusOnNextRowContent, 'emit');
        component.ngAfterContentInit();
      });

      describe('and the content is pressed with Ctrl + PageUp', () => {
        beforeEach(() => {
          content.triggerEventHandler('keydown', { ctrlKey: true, keyCode: 33 } as KeyboardEvent);
        });

        it('go up event is emitted', () => {
          expect(component.listContent.goUp.emit).toHaveBeenCalled();
        });
        it('setFocusOnPreviousRowContent event is emitted', () => {
          expect(component.setFocusOnPreviousRowContent.emit).toHaveBeenCalled();
        });
      });

      describe('and the content is pressed with Ctrl + PageDown', () => {
        beforeEach(() => {
          content.triggerEventHandler('keydown', { ctrlKey: true, keyCode: 34 } as KeyboardEvent);
        });

        it('go up event is emitted', () => {
          expect(component.listContent.goDown.emit).toHaveBeenCalled();
        });
        it('setFocusOnNextRowContent event is emitted', () => {
          expect(component.setFocusOnNextRowContent.emit).toHaveBeenCalled();
        });
      });
    });

    describe('the component is clicked outside of the list-item-header', () => {
      beforeEach(() => {
        spyOn(component, 'toggleExpand');
        rootElement.triggerEventHandler('click', event);
        listItemComponentFixture.detectChanges();
      });
      it('component is not expanded', () => {
        expect(component.expanded).toBeFalsy();
      });
      it('content is not visible', () => {
        expect(component.toggleExpand).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('When initialized with a Permanent notification is set,', () => {
    beforeEach(() => {
      component.notification = { message: 'Information', icon: 'vgr-icon-ok-check ', type: NotificationType.Permanent } as RowNotification;
      component.ngAfterContentInit();
    });
    it('notification is displayed', () => {
      expect(component.notificationVisible).toBe(true);
    });
  });

  describe('When expanded is set to true', () => {
    beforeEach(() => {
      spyOn(component.expandedChanged, 'emit');
      component.expanded = true;
      listItemComponentFixture.detectChanges();
    });

    it('the property expanded is set to true', () => {
      expect(component.expanded).toBe(true);
    });

    it('expandedChanged is called', () => {
      expect(component.expandedChanged.emit).toHaveBeenCalled();
    });

    // describe('and a ShowOnCollapse notification is set', () => {
    //   beforeEach(() => {
    //     spyOn(component, 'collapseContent').and.callFake((header: any, callback: Function) => { callback(); });
    //     component.notification = { message: 'Row saved', icon: 'vgr-icon-ok-check ', type: NotificationType.ShowOnCollapse } as RowNotification;
    //   });
    //   it('notification is displayed', () => {
    //     expect(component.notificationVisible).toBe(true);
    //   });
    //   it('component is collapsing', () => {
    //     expect(component.notInteractable).toBe(true);
    //   });

      // describe('after 1,4 seconds', () => {
      //   beforeEach(() => {
      //     jasmine.clock().tick(1400);
      //   });
      //   it('content is collapsed', () => {
      //     expect(jqueryHelper.collapseContent).toHaveBeenCalled();
      //   });
      //   describe('after another 2 seconds', () => {
      //     beforeEach(() => {
      //       jasmine.clock().tick(2000);
      //       fixture.detectChanges();
      //     });
      //     it('the notification is hidden', () => {
      //       expect(component.notificationVisible).toBe(false);
      //     });
      //     it('the notification is done', () => {
      //       expect(component.notification.done).toBe(true);
      //     });
      //     it('component is not expanded', () => {
      //       expect(component.expanded).toBe(false);
      //     });
      //     it('component is not collapsing', () => {
      //       expect(component.notInteractable).toBe(false);
      //     });
      //   });
      // });
    });

    // describe('and a ShowOnRemove notification is set', () => {
    //   beforeEach(() => {
    //     spyOn(jqueryHelper, 'collapseContent').and.callFake((header: any, callback: Function) => { callback(); });
    //     component.notification = { message: 'Row deleted', icon: 'vgr-icon-ok-check ', type: NotificationType.ShowOnRemove } as RowNotification;
    //   });
    //   it('notification is displayed', () => {
    //     expect(component.notificationVisible).toBe(true);
    //   });
    //   it('component is collapsing', () => {
    //     expect(component.notInteractable).toBe(true);
    //   });

    //   describe('after 1,4 seconds', () => {
    //     beforeEach(() => {
    //       jasmine.clock().tick(1400);
    //     });
    //     it('content is collapsed', () => {
    //       expect(jqueryHelper.collapseContent).toHaveBeenCalled();
    //     });
    //     describe('after another 2 seconds', () => {
    //       beforeEach(() => {
    //         jasmine.clock().tick(2000);
    //         fixture.detectChanges();
    //       });
    //       it('the notification is hidden', () => {
    //         expect(component.notificationVisible).toBe(false);
    //       });
    //       it('the notification is done', () => {
    //         expect(component.notification.done).toBe(true);
    //       });
    //       it('component is not expanded', () => {
    //         expect(component.expanded).toBe(false);
    //       });
    //       it('component is not collapsing', () => {
    //         expect(component.notInteractable).toBe(false);
    //       });
    //       it('component is deleted', () => {
    //         expect(component.isDeleted).toBe(true);
    //       });
    //     });
    //   });
    // });

  // });

  // describe('When item is collapsing', () => {
  //   beforeEach(() => {
  //     spyOn(jqueryHelper, 'isClickEventHeader').and.returnValue(true);
  //     spyOn(jqueryHelper, 'toggleContent');
  //     component.notInteractable = true;
  //   });
  //   describe('and header is clicked', () => {
  //     beforeEach(() => {
  //       rootElement.triggerEventHandler('click', null);
  //       fixture.detectChanges();
  //     });
  //     it('item is not expanded', () => {
  //       expect(component.expanded).toBeFalsy();
  //     });
  //     it('content is not visible', () => {
  //       expect(jqueryHelper.toggleContent).toHaveBeenCalledTimes(0);
  //     });
  //   });
  //   describe('and expanded is set to true', () => {
  //     beforeEach(() => {
  //       component.expanded = true;
  //       fixture.detectChanges();
  //     });
  //     it('item is not expanded', () => {
  //       expect(component.expanded).toBeFalsy();
  //     });
  //     it('content is not visible', () => {
  //       expect(jqueryHelper.toggleContent).toHaveBeenCalledTimes(0);
  //     });
  //   });
  // });
});
