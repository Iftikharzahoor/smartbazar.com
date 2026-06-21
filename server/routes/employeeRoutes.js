import express from 'express';
import {
  getEmployees,
  getEmployeeStats,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
  checkInEmployee,
  checkOutEmployee,
  paySalaryEmployee,
  getNotices,
  postNotice,
  getLeaderboard
} from '../controllers/employeeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public Employee Portal Endpoints
router.post('/login', loginEmployee);
router.post('/check-in', checkInEmployee);
router.post('/check-out', checkOutEmployee);
router.post('/pos-sale', recordPosSaleEmployee);
router.get('/notices', getNotices);
router.get('/leaderboard', getLeaderboard);

// Admin-Only Employee HR Records Management Endpoints
router.use(protect);
router.use(admin);

router.get('/', getEmployees);
router.get('/stats', getEmployeeStats);
router.post('/notices', postNotice);
router.put('/:id/pay', paySalaryEmployee);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
