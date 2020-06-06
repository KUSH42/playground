import { TypewriterDirective } from './typewriter.directive';
import { ElementRef } from '@angular/core';

describe('TypewriterDirective', () => {
  it('should create an instance', () => {
    const directive = new TypewriterDirective(new ElementRef(null));
    expect(directive).toBeTruthy();
  });
});
