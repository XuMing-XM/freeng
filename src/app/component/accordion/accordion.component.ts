import { CommonModule } from '@angular/common';
import { NgModule, Component, OnInit, Input} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ShareModule } from '../common/share';

@Component({
  selector: 'free-accordion-group',
  template: '<div class="free-accordion-group"><ng-content></ng-content></div>'
})

export class AccordionGroupComponent {
  @Input() closeOthers: boolean;
  @Input() style: any;
  groups: AccordionComponent[] = [];
  constructor() {}

  closeOther(activeItem: AccordionComponent) {
    if (!this.closeOthers) {
      return;
    }
    this.groups.forEach((item: AccordionComponent) => {
      if (item !== activeItem) {
        item.selected = false;
      }
    });
  }

  addGroup(item: AccordionComponent) {
    this.groups.push(item);
  }
}

@Component({
  selector: 'free-accordion',
  template: `
    <div class="accordion-item" [class.free-accordion-disabled]="disabled">
      <div (click)="toggle()" class="accordion-toggle" [ngStyle]="style || accordionGroup.style"
           [ngClass]="itemClass">
        <span class="accordion-toggle-inner">
          <ng-container *ngIf="header">
            <i class="fa {{'fa-' + _icon}}" *ngIf="!!_icon"></i>
            <span class="accordion-toggle-title">{{ header }}</span>
          </ng-container>
          <ng-content select="f-header"></ng-content>
        </span>
      </div>
      <div class="accordion-content" [@accordionState]="isActive" (@accordionState.done)="transitionDone()"
          (@accordionState.start)="transitionStart()">
        <div class="accordion-inner">
          <ng-content></ng-content>
        </div>
      </div>
    </div>`,
  animations: [trigger('accordionState', [
    state('active', style({
      height: '*'
    })),
    state('inactive', style({
      height: 0
    })),
    transition('inactive <=> active', animate('300ms ease'))
  ])]
})
export class AccordionComponent implements OnInit {
  @Input() header: string;
  @Input() disabled: boolean;
  @Input() toggleable: boolean;
  @Input() style: any;
  @Input()
  get iconName(): string {
    return this._icon;
  }

  set iconName(value: string) {
    this._icon = value;
  }

  @Input()
  get selected() {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
    if (this._selected) {
      this.accordionGroup.closeOther(this);
    }
    this.toggleClass();
  }

  _selected: boolean;
  _icon: string;
  isActive: string;
  itemClass: any;
  isAnimating: boolean;
  accordionGroup: AccordionGroupComponent;
  constructor(accordionGroup: AccordionGroupComponent) {
    this.accordionGroup = accordionGroup;
    this.toggleable = true;
    this.isActive = 'inactive';
    this.itemClass = {};
  }

  ngOnInit() {
    this.accordionGroup.addGroup(this);
    this.toggleClass();
  }

  toggleClass() {
    if (!this.isAnimating && !this.disabled) {
      this.isActive = this.selected ? 'active' : 'inactive';
      this.itemClass = {
        'accordion-item-expand': this.selected
      };
    }
  }

  toggle() {
    if (!this.disabled) {
      this.selected = !this.selected;
    }
  }

  transitionStart() {
    this.isAnimating = true;
  }

  transitionDone() {
    this.isAnimating = false;
  }

}

@NgModule({
  imports: [CommonModule],
  declarations: [AccordionComponent, AccordionGroupComponent],
  exports: [AccordionComponent, AccordionGroupComponent, ShareModule]
})

export class AccordionModule {}
