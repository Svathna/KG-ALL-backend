import { Typegoose, prop } from 'typegoose';
import { MonthlyTaxReturn } from '../interfaces/monthly-tax-return.interface';
import { AnnualTaxReturn } from '../interfaces/annual-tax-return.interface';

class Service extends Typegoose {
  @prop({ required: true })
  monthlyTaxReturn: MonthlyTaxReturn;

  @prop({ required: true })
  AnnualTaxReturn: AnnualTaxReturn;

  @prop({ required: true })
  docUrl: boolean;
}

export default Service;
