import { Component, EventEmitter, forwardRef, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICalculator } from 'src/app/interfaces/calculator';
import { CardCalculatorService } from 'src/app/services/card-calculator.service';

@Component({
  selector: 'app-card-calculator',
  templateUrl: './card-calculator.component.html',
  styleUrls: ['./card-calculator.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CardCalculatorComponent),
      multi: true
    }
  ]
})
export class CardCalculatorComponent implements OnDestroy, ControlValueAccessor {
  amount: number = 0;
  cards: number[] = [];
  possibleAmounts: number[] = [];
  @Output() amountChange = new EventEmitter<number>();

  subscriptions: Subscription = new Subscription();

  constructor(private cardCalculatorService: CardCalculatorService) { }

  validateAmount(): void {
    this.subscriptions.add(
      this.cardCalculatorService.getCombination(this.amount).subscribe(response => {
        if (response.status === 200) {
          if (response.body) this.handleDesiredAmount(response.body);
          else console.log('Error');
        } else {
          console.log('Error');
        }
      })
    );
  }

  handleDesiredAmount(response: ICalculator) {
    this.possibleAmounts = [];
    this.amountChange.emit(this.amount);
    if (response.equal) {
      this.cards = response.equal.cards;
    } else {
      this.cards = [];
      this.suggestPossibleAmounts(response);
    }
  }

  suggestPossibleAmounts(response: ICalculator) {
    if (response.floor && response.ceil) {
      this.possibleAmounts.push(response.ceil.value);
      this.possibleAmounts.push(response.floor.value);
    } else if (response.floor) {
      this.amount = response.floor.value;
      this.validateAmount();
    } else if (response.ceil) {
      this.amount = response.ceil.value;
      this.validateAmount();
    }
  }

  incrementAmount() {
    this.amount++;
    this.validateAmount();
  }

  decrementAmount() {
    this.amount--;
    this.validateAmount();
  }

  writeValue(value: number): void {
    this.amount = value;
    this.validateAmount();
  }

  registerOnChange(fn: any): void {
    this.amountChange.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
