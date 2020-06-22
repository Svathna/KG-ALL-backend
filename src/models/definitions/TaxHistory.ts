import { Typegoose, prop, arrayProp } from 'typegoose';
import { TaxPerMonth } from '../interfaces/tax-per-month.interface';
import { TaxPerYear } from '../interfaces/tax-per-year.interface';

class TaxHistory extends Typegoose {
  @arrayProp({ required: true, items: TaxPerMonth })
  taxPerMonths: TaxPerMonth[];

  @arrayProp({ required: true, items: TaxPerYear })
  taxPerYears: TaxPerYear[];

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default TaxHistory;
