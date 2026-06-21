import express from 'express';
import {
  getEmployees,
  getEmployeeStats,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth and admin check middleware to protect all routes
router.use(protect);
router.use(admin);

router.get('/', getEmployees);
router.get('/stats', getEmployeeStats);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
