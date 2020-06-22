import { Router } from 'express';
const app = Router();

import tax from './tax';

app.use('/', tax);

export default app;
