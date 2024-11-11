import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface EmployeeDocument extends mongoose.Document {
  Email: string;
  Password: string;
  Verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  FirstName: string;
  LastName: string;
  Title?: string;
  ReportsTo?: mongoose.Types.ObjectId; // Optional, references another Employee
  BirthDate?: Date;
  HireDate?: Date;
  Address?: string;
  City?: string;
  State?: string;
  Country?: string;
  PostalCode?: string;
  Phone?: string;
  IsManager: boolean; // Boolean to indicate if the employee is a manager
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Omit<EmployeeDocument, "Password">;
}

const employeeSchema = new mongoose.Schema<EmployeeDocument>(
  {
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Verified: { type: Boolean, required: true, default: false },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Title: { type: String },
    ReportsTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Self-referencing for manager hierarchy
    BirthDate: { type: Date },
    HireDate: { type: Date },
    Address: { type: String },
    City: { type: String },
    State: { type: String },
    Country: { type: String },
    PostalCode: { type: String },
    Phone: { type: String },
    IsManager: { type: Boolean, default: false }, // New field for manager status
  },
  {
    timestamps: true,
  }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) {
    return next();
  }

  this.Password = await hashValue(this.Password);
  return next();
});

employeeSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.Password);
};

employeeSchema.methods.omitPassword = function () {
  const employee = this.toObject();
  delete employee.Password;
  return employee;
};

const EmployeeModel = mongoose.model<EmployeeDocument>("Employee", employeeSchema, "employee");
export default EmployeeModel;