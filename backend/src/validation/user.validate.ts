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

    
    