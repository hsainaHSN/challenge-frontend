import { ICalculatorComponentValue } from "./calculator-component-value";

export interface ICalculator {
    equal: ICalculatorComponentValue;
    floor: ICalculatorComponentValue;
    ceil: ICalculatorComponentValue;
}
