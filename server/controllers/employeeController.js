import Employee from '../models/Employee.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

// @desc    Get all employees (with search, role and attendance filtering)
// @route   GET /api/v1/employees
// @access  Private/Admin
export const getEmployees = async (req, res, next) => {
  try {
    const { search, role, attendanceStatus } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (attendanceStatus) {
      query.attendanceStatus = attendanceStatus;
    }

    const employees = await Employee.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/v1/employees/:id
// @access  Private/Admin
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new employee record
// @route   POST /api/v1/employees
// @access  Private/Admin
export const createEmployee = async (req, res, next) => {
  try {
    const { employeeId, name, role, phoneNumber, attendanceStatus, salary, joiningDate } = req.body;

    // Check unique employeeId
    const existing = await Employee.findOne({ employeeId });
    if (existing) {
      return next(new ErrorResponse('Employee with this ID already exists', 400));
    }

    const employee = await Employee.create({
      employeeId,
      name,
      role,
      phoneNumber,
      attendanceStatus: attendanceStatus || 'Present',
      salary,
      joiningDate: joiningDate || undefined
    });

    res.status(201).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee details
// @route   PUT /api/v1/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }

    const { employeeId } = req.body;
    if (employeeId && employeeId !== employee.employeeId) {
      const existing = await Employee.findOne({ employeeId });
      if (existing) {
        return next(new ErrorResponse('Employee with this ID already exists', 400));
      }
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee record
// @route   DELETE /api/v1/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Employee record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employee quick stats
// @route   GET /api/v1/employees/stats
// @access  Private/Admin
export const getEmployeeStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const presentToday = await Employee.countDocuments({ attendanceStatus: 'Present' });

    res.status(200).json({
      success: true,
      totalEmployees,
      presentToday
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log in employee via portal
// @route   POST /api/v1/employees/login
// @access  Public
export const loginEmployee = async (req, res, next) => {
  const { employeeId, password } = req.body;

  try {
    if (!employeeId || !password) {
      return next(new ErrorResponse('Please provide employee ID and password', 400));
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return next(new ErrorResponse('Invalid employee ID', 401));
    }

    if (employee.password !== password) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check-in employee (sets status to Present)
// @route   POST /api/v1/employees/check-in
// @access  Public
export const checkInEmployee = async (req, res, next) => {
  const { employeeId } = req.body;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }

    employee.attendanceStatus = 'Present';
    await employee.save();

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};
