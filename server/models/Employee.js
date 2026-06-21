import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Please add an employee ID'],
    unique: true,
    trim: true
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
  joiningDate: {
    type: Date,
    required: [true, 'Please add a joining date'],
    default: Date.now
  }
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
