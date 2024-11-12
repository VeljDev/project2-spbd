import { z } from "zod";


export const emailSchema = z.string().email().min(1).max(255);
const passwordSchema = z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(14, { message: "Password cannot be longer than 14 characters" })
    .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter (A-Z)"
    })
    .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter (a-z)"
    })
    .refine((password) => /[0-9]/.test(password), {
        message: "Password must contain at least one number (0-9)"
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>_-]/.test(password), {
        message: "Password must contain at least one special character (e.g. !, @, #, $)"
    });

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional()
});

export const registerSchema = loginSchema.extend({
    confirmPassword: z.string().min(6).max(14),
    firstName: z.string().min(2).max(40),
    lastName: z.string().min(2).max(50),
}).refine(
    (data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
}
);

export const verificationCodeSchema = z.string().min(1).max(24);

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    verificationCode: verificationCodeSchema,
});