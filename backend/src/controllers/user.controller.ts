import logger from "../config/logger";
import { NOT_FOUND, OK } from "../constants/http";
import EmployeeModel from "../models/employee.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";


export const getUserHandler = catchErrors(async (req, res) => {
    logger.info("User retrieval attempt");

    const employee = await EmployeeModel.findById(req.employeeId);
    appAssert(employee, NOT_FOUND, "Employee not found");

    logger.info("User retrieved successfully");

    return res.status(OK).json(employee.omitPassword());
});