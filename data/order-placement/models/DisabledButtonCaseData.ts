import type { DisabledButtonCase } from '../types/DisabledButtonCase';
import rawCases from '../templates/disabledButtonCases.json';

export class DisabledButtonCaseData {
  private readonly cases: DisabledButtonCase[] = rawCases as DisabledButtonCase[];

  getAll(): DisabledButtonCase[] {
    return this.cases;
  }
}
