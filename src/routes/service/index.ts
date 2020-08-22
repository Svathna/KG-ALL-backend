import { Router } from 'express';
const app = Router();

import service from './service';

app.use('/', service);

export default app;
