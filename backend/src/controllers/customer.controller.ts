import logger from "../config/logger";
import { OK } from "../constants/http";
import { getCustomers } from "../services/customer.service";
import catchErrors from "../utils/catchErrors";


export const getCustomerHandler = catchErrors(async (req, res) => {
    logger.info("Customers retrieval attempt");

    const customers = await getCustomers({employeeId: req.employeeId});

    logger.info("Customers retrieved successfully");

    return res.status(OK).json(customers);
});