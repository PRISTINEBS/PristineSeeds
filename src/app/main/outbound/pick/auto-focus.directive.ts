import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[datoAutoFocus]'
})
export class AutoFocusDirective {

    public constructor(
        private host: ElementRef,
    ) {
    }

    @Input()
    public set datoAutoFocus(value) {
        if (!!value) {
            this.host.nativeElement.focus();
        }
    }


}