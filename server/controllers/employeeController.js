import Employee from '../models/Employee.js';
import Notice from '../models/Notice.js';
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
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
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
    const { employeeId, email, password, name, role, phoneNumber, attendanceStatus, salary, joiningDate } = req.body;

    if (!email) {
      return next(new ErrorResponse('Please provide an email address', 400));
    }

    // Check unique employeeId
    const existingId = await Employee.findOne({ employeeId });
    if (existingId) {
      return next(new ErrorResponse('Employee with this ID already exists', 400));
    }

    // Check unique email
    const existingEmail = await Employee.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return next(new ErrorResponse('Employee with this email already exists', 400));
    }

    const employee = await Employee.create({
      employeeId,
      email: email.toLowerCase(),
      password: password || 'password123',
      name,
      role,
      phoneNumber,
      attendanceStatus: attendanceStatus || 'Absent',
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

    const { employeeId, email } = req.body;
    if (employeeId && employeeId !== employee.employeeId) {
      const existing = await Employee.findOne({ employeeId });
      if (existing) {
        return next(new ErrorResponse('Employee with this ID already exists', 400));
      }
    }

    if (email && email.toLowerCase() !== employee.email) {
      const existingEmail = await Employee.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return next(new ErrorResponse('Employee with this email already exists', 400));
      }
    }

    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
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
      return next(new ErrorResponse('Please provide employee ID/Email and password', 400));
    }

    const employee = await Employee.findOne({
      $or: [
        { employeeId: employeeId },
        { email: employeeId.toLowerCase() }
      ]
    });

    if (!employee) {
      return next(new ErrorResponse('Invalid credentials', 401));
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

// @desc    Check-in employee (sets status to Present, creates today's log)
// @route   POST /api/v1/employees/check-in
// @access  Public
export const checkInEmployee = async (req, res, next) => {
  const { employeeId } = req.body;

  try {
    if (!employeeId) {
      return next(new ErrorResponse('Employee ID or Email is required', 400));
    }

    const employee = await Employee.findOne({
      $or: [
        { employeeId: employeeId },
        { email: employeeId.toLowerCase() }
      ]
    });

    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }

    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const checkInTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Check if log already exists for today
    let logIndex = employee.logs.findIndex(log => log.date === todayStr);
    
    const isLate = checkInTime > '09:00';
    const notes = isLate ? 'Late Check-in' : 'On-time Check-in';

    if (logIndex !== -1) {
      // If already present, don't overwrite check-in unless we want to reset
      employee.logs[logIndex].status = 'Present';
      employee.logs[logIndex].checkInTime = checkInTime;
      employee.logs[logIndex].notes = notes;
    } else {
      employee.logs.push({
        date: todayStr,
        status: 'Present',
        checkInTime,
        hoursWorked: 0,
        customersDealt: 0,
        salesGenerated: 0,
        notes
      });
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

// @desc    Check-out employee (calculates hours worked, updates logs status)
// @route   POST /api/v1/employees/check-out
// @access  Public
export const checkOutEmployee = async (req, res, next) => {
  const { employeeId } = req.body;

  try {
    if (!employeeId) {
      return next(new ErrorResponse('Employee ID or Email is required', 400));
    }

    const employee = await Employee.findOne({
      $or: [
        { employeeId: employeeId },
        { email: employeeId.toLowerCase() }
      ]
    });

    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }

    const todayStr = new Date().toLocaleDateString('en-CA');
    let logIndex = employee.logs.findIndex(log => log.date === todayStr);

    if (logIndex === -1) {
      return next(new ErrorResponse('No active check-in record found for today. Please check-in first.', 400));
    }

    const checkOutTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const log = employee.logs[logIndex];

    log.checkOutTime = checkOutTime;

    // Calculate hours worked
    const [inH, inM] = log.checkInTime.split(':').map(Number);
    const [outH, outM] = checkOutTime.split(':').map(Number);
    const diffMins = (outH * 60 + outM) - (inH * 60 + inM);
    const hoursWorked = Math.max(0, Number((diffMins / 60).toFixed(2)));
    log.hoursWorked = hoursWorked;

    // Set logs status based on hours
    let status = 'Present';
    let overtimeStr = '';
    if (hoursWorked >= 8) {
      status = 'Full Shift';
      if (hoursWorked > 8) {
        overtimeStr = ` (Overtime: ${(hoursWorked - 8).toFixed(2)} hrs)`;
      }
    } else if (hoursWorked < 4) {
      status = 'Half Leave';
    }

    log.status = status;
    log.notes = `${log.notes || ''} | Checked out at ${checkOutTime}${overtimeStr}`;

    employee.attendanceStatus = 'Absent';
    await employee.save();

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record transaction completed at POS (1% commission + logs sales)
// @route   POST /api/v1/employees/pos-sale
// @access  Public
export const recordPosSaleEmployee = async (req, res, next) => {
  const { employeeId, amount } = req.body;

  try {
    if (!employeeId || amount === undefined) {
      return next(new ErrorResponse('Employee ID/Email and transaction amount are required', 400));
    }

    const employee = await Employee.findOne({
      $or: [
        { employeeId: employeeId },
        { email: employeeId.toLowerCase() }
      ]
    });

    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }

    const saleAmount = Number(amount);
    const commission = Number((saleAmount * 0.01).toFixed(2));

    employee.totalSales += saleAmount;
    employee.commissionEarned += commission;

    const todayStr = new Date().toLocaleDateString('en-CA');
    let logIndex = employee.logs.findIndex(log => log.date === todayStr);

    if (logIndex !== -1) {
      employee.logs[logIndex].salesGenerated += saleAmount;
      employee.logs[logIndex].customersDealt += 1;
    } else {
      // Create a default Present log if they transact without checking in first (just in case)
      const checkInTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      employee.logs.push({
        date: todayStr,
        status: 'Present',
        checkInTime,
        hoursWorked: 0,
        customersDealt: 1,
        salesGenerated: saleAmount,
        notes: 'POS transaction compiled auto-check-in'
      });
      employee.attendanceStatus = 'Present';
    }

    await employee.save();

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pay salary to employee
// @route   PUT /api/v1/employees/:id/pay
// @access  Private/Admin
export const paySalaryEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return next(new ErrorResponse('Employee not found', 404));
    }

    employee.salaryStatus = 'Paid';
    await employee.save();

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get store notices
// @route   GET /api/v1/employees/notices
// @access  Public
export const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().sort('-createdAt').limit(20);
    res.status(200).json({
      success: true,
      notices
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notice board announcement
// @route   POST /api/v1/employees/notices
// @access  Private/Admin
export const postNotice = async (req, res, next) => {
  const { content, author } = req.body;

  try {
    if (!content) {
      return next(new ErrorResponse('Notice content is required', 400));
    }

    const notice = await Notice.create({
      content,
      author: author || 'Admin'
    });

    res.status(201).json({
      success: true,
      notice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard rankings
// @route   GET /api/v1/employees/leaderboard
// @access  Public
export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Employee.find({}, 'name role totalSales commissionEarned').sort('-totalSales');
    res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    next(error);
  }
};
