import { Router } from 'express';
const app = Router();

import user from './user';
import company from './company';

app.use('/user', user);
app.use('/company', company);

export default app;
