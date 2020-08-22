import { Typegoose, prop } from 'typegoose';
import { MonthlyTaxReturnService } from '../interfaces/monthly-tax-return.interface';
import { AnnualTaxReturnService } from '../interfaces/annual-tax-return.interface';

class Service extends Typegoose {
  @prop({ required: true })
  monthlyTaxReturnService: MonthlyTaxReturnService;

  @prop({ required: true })
  annualTaxReturnService: AnnualTaxReturnService;

  @prop({ required: true })
  docUrl: string;
}

export default Service;
