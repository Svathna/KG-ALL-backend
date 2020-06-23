import { Router } from 'express';
const app = Router();

import request from './request';

app.use('/', request);

export default app;
