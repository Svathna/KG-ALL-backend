import { Router } from 'express';
const app = Router();

import moc from './moc';

app.use('/', moc);

export default app;
