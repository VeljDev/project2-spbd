import { Router } from "express";
import { getCustomerHandler } from "../controllers/customer.controller";


const customerRoutes = Router();

// prefix: /customers
customerRoutes.get("/", getCustomerHandler);

export default customerRoutes;