import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half Leave', 'Full Shift'],
    required: true
  },
  checkInTime: {
    type: String
  },
  checkOutTime: {
    type: String
  },
  hoursWorked: {
    type: Number,
    default: 0
  },
  customersDealt: {
    type: Number,
    default: 0
  },
  salesGenerated: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, { _id: false });

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Please add an employee ID'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    default: 'password123'
  },
  name: {
    type: String,
    required: [true, 'Please add an employee name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    enum: ['Manager', 'Cashier', 'Salesperson'],
    default: 'Salesperson'
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true
  },
  attendanceStatus: {
    type: String,
    required: [true, 'Please add attendance status'],
    enum: ['Present', 'Absent', 'Leave'],
    default: 'Present'
  },
  salary: {
    type: Number,
    required: [true, 'Please add salary details'],
    min: [0, 'Salary must be positive']
  },
  totalSales: {
    type: Number,
    default: 0
  },
  commissionEarned: {
    type: Number,
    default: 0
  },
  salaryStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  },
  joiningDate: {
    type: Date,
    required: [true, 'Please add a joining date'],
    default: Date.now
  },
  logs: [LogSchema]
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
