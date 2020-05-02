import { Router } from 'express';
const app = Router();

import company from './company';

app.use('/', company);

export default app;
