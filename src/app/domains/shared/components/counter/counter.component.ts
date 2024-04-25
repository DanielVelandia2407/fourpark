import {Component, Input, signal, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent {
  @Input({required: true}) duration = 0;
  @Input({required: true}) message = '';
  counter = signal(0);
  counterRef: number | undefined;

  constructor() {
    // No async calls in constructor
    // Before rendering the component
    // Once the component is created
    console.log('CounterComponent constructor');
    console.log('-'.repeat(10))
  }

  ngOnChanges(changes: SimpleChanges) {
    //Before rendering the component
    console.log('ngOnChanges');
    console.log('-'.repeat(10));
    console.log(changes);
    const duration = changes['duration'];
    if (duration && !duration.firstChange){
      this.doSomething();
    }
  }

  ngOnInit() {
    //After rendering the component
    //Once the component is created
    //Async calls can be made here
    console.log('ngOnInit');
    console.log('-'.repeat(10));
    console.log('duration =>', this.duration);
    console.log('message =>', this.message);
    this.counterRef = window.setInterval(() => {
      this.counter.update(statePrev => statePrev + 1);
    }, 1000);
  }

  ngAfterViewInit() {
    //After rendering the component
    console.log('ngAfterViewInit');
    console.log('-'.repeat(10));
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    console.log('-'.repeat(10));
    window.clearInterval(this.counterRef);
  }

  doSomething() {
    console.log('doSomething');
    console.log('-'.repeat(10));
  }

}
