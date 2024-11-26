import mongoose from "mongoose";
import { NOT_FOUND } from "../constants/http";
import EmployeeModel from "../models/employee.model";
import appAssert from "../utils/appAssert";
import CustomerModel from "../models/customer.model";


type GetCustomersParams = {
    employeeId: mongoose.Types.ObjectId;
};

export const getCustomers = async({ employeeId }: GetCustomersParams) => {
    // Get employee by id
    const employee = await EmployeeModel.findById(employeeId);
    appAssert(employee, NOT_FOUND, "Employee not found");

    // Get customers
    const customers = await CustomerModel.getAllCustomers(employeeId, employee.IsManager);

    // Return customers
    return customers;
};