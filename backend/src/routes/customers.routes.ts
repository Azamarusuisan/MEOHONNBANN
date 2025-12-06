import { Router } from 'express';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customers.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const customersRouter = Router();

customersRouter.use(authMiddleware);

customersRouter.get('/', getCustomers);
customersRouter.get('/:id', getCustomer);
customersRouter.post('/', createCustomer);
customersRouter.put('/:id', updateCustomer);
customersRouter.delete('/:id', deleteCustomer);
