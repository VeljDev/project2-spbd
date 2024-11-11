import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      employeeId: mongoose.Types.ObjectId;
      sessionId: mongoose.Types.ObjectId;
    }
  }
}
export {};