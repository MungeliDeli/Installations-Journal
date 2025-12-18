// src/validation/installation.validation.ts

import Joi from "joi";

export const installationSchema = Joi.object({
  customer: Joi.string().required().messages({
    "string.empty": "Customer is required",
    "any.required": "Customer is required",
  }),
  reference: Joi.string().required().messages({
    "string.empty": "Reference is required",
    "any.required": "Reference is required",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
    "any.required": "Phone number is required",
  }),
  location: Joi.string().required().messages({
    "string.empty": "Location is required",
    "any.required": "Location is required",
  }),
  installedAt: Joi.date().required().messages({
    "date.base": "Installation date must be a valid date",
    "any.required": "Installation date is required",
  }),

  speed: Joi.number().positive().required().messages({
    "number.base": "Speed must be a number",
    "number.positive": "Speed must be a positive number",
    "any.required": "Speed is required",
  }),
  notes: Joi.string().allow("").optional(),
  rsrp: Joi.number().required().messages({
    "number.base": "RSRP must be a number",
    "any.required": "RSRP is required",
  }),
}).options({
  // Allow unknown keys (this will let 'images' pass through without validation)
  // Images are validated by multer middleware
  allowUnknown: true,
  stripUnknown: false,
});
