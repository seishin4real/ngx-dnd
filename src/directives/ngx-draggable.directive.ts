import {
  Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnDestroy, OnInit
} from '@angular/core';

import { DrakeStoreService } from '../services/drake-store.service';

/**
 * 
 * @export
 * @class NgxDndItemDirective
 */
@Directive({ selector: '[ngxDraggable]' })
export class DraggableDirective implements OnInit, OnDestroy {

  @Input()
  model: any;

  @Output()
  drag: EventEmitter<any> = new EventEmitter<any>();

  dragDelay: number = 200; // milliseconds
  draggable: boolean = false;
  touchTimeout: any;
  element: any;

  constructor(
    private el: ElementRef,
    private drakesService: DrakeStoreService
  ) {
    this.element = el.nativeElement;
  }

  // From: https://github.com/bevacqua/dragula/issues/289#issuecomment-277143172
  @HostListener('touchmove', ['$event'])
  onMove(e: Event) {
    if (!this.draggable) {
      e.stopPropagation();
      clearTimeout(this.touchTimeout);
    }
  }

  @HostListener('touchstart', ['$event'])
  onDown(e: Event) {
    this.touchTimeout = setTimeout(() => {
      this.draggable = true;
    }, this.dragDelay);
  }

  @HostListener('touchend', ['$event'])
  onUp(e: Event) {
    clearTimeout(<number>this.touchTimeout);
    this.draggable = false;
  }

  ngOnInit(): void {
    this.drakesService.registerDraggable(this);
  }

  ngOnDestroy() {
    this.drakesService.removeDraggable(this);
  }
}
