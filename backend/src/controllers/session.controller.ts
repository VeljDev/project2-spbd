import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import SessionModel from "../models/session.models";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";


export const getSessionsHandler = catchErrors(async (req, res) => {
    const sessions = await SessionModel.find(
        {
            employeeId: req.employeeId,
            expiresAt: { $gt: new Date() }
        },
        {
            _id: 1,
            userAgent: 1,
            createdAt: 1,
            expiresAt: 1
        },
        {
            sort: { createdAt: -1 }
        }
    );

    return res.status(OK).json(
        sessions.map((session) => ({
            ...session.toObject(),
            ...(
                session.id === req.sessionId && {
                    isCurrent: true
                }
            )
        }))
    );
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
    const sessionId = z.string().parse(req.params.id);
    const deleted = await SessionModel.findOneAndDelete({
        _id: sessionId,
        employeeId: req.employeeId,
    });
    appAssert(deleted, NOT_FOUND, "Session not found");
    return res.status(OK).json({ message: "Session removed" });
});