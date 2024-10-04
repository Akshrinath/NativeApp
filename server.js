const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const mongoDBUrl = "mongodb+srv://root:root@cluster0.pwr5n.mongodb.net/company?retryWrites=true&w=majority&appName=Cluster0"; // MongoDB URL with database 'company'

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoDBUrl).then(() => {
  console.log("Connected to MongoDB");
  const PORT = 4000;  // Define the port directly in the file
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Define the Employee schema and model (automatically links to 'employees' collection)
const EmployeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  age: Number,
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// API endpoint to get all employees from 'employees' collection
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

// Create a new employee
app.post('/employees', async (req, res) => {
  const newEmployee = new Employee(req.body);
  try {
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: "Error creating employee", error });
  }
});

// Update an existing employee
app.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: "Error updating employee", error });
  }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(204).send();  // No content
  } catch (error) {
    res.status(400).json({ message: "Error deleting employee", error });
  }
});

