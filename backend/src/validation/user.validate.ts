import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be atleast a minimum of 3 characters",
    "string.max": "Name must not exceed 30 characters",
    "any.required": "Name is required",
  }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)")).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "any.required": "Password is required",
    }),
    phone: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required().messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must be a valid 10-digit number",
        "any.required": "Phone number is required",
    }),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional().messages({
    "string.min": "Name must be atleast a minimum of 3 characters",
    "string.max": "Name must not exceed 30 characters",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string().pattern(new RegExp("^[0-9]{10}$")).optional().messages({
    "string.pattern.base": "Phone number must be a valid 10-digit number",
  }),
  supervisor: Joi.string().max(50).optional().allow('').messages({
    "string.max": "Supervisor name must not exceed 50 characters",
  }),
  cluster: Joi.string().max(50).optional().allow('').messages({
    "string.max": "Cluster name must not exceed 50 characters",
  }),
  dailyTarget: Joi.number().integer().min(1).max(1000).optional().messages({
    "number.base": "Daily target must be a number",
    "number.integer": "Daily target must be a whole number",
    "number.min": "Daily target must be at least 1",
    "number.max": "Daily target must not exceed 1000",
  }),
  weeklyTarget: Joi.number().integer().min(1).max(1000).optional().messages({
    "number.base": "Weekly target must be a number",
    "number.integer": "Weekly target must be a whole number",
    "number.min": "Weekly target must be at least 1",
    "number.max": "Weekly target must not exceed 1000",
  }),
  monthlyTarget: Joi.number().integer().min(1).max(1000).optional().messages({
    "number.base": "Monthly target must be a number",
    "number.integer": "Monthly target must be a whole number",
    "number.min": "Monthly target must be at least 1",
    "number.max": "Monthly target must not exceed 1000",
  }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)")).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 8 characters long",
    "string.pattern.base": "New password must contain at least one uppercase letter, one lowercase letter, and one number",
    "any.required": "New password is required",
  }),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
  }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
});

    
    