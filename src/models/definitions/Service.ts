import { Typegoose, prop } from 'typegoose';
import { MonthlyTaxService } from '../interfaces/monthly-tax-return.interface';
import { AnnualTaxService } from '../interfaces/annual-tax-return.interface';

class Service extends Typegoose {
  @prop({ required: true })
  monthlyTaxService: MonthlyTaxService;

  @prop({ required: true })
  annualTaxService: AnnualTaxService;

  @prop({ required: true })
  docUrl: string;
}

export default Service;
