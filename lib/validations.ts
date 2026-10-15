import Joi from "joi"

/**
 * Reusable Joi validation schemas matching OpenAPI 3.0.3 contracts
 * and Bara Product Specifications v1.
 */

export interface ValidationResult<T> {
  isValid: boolean
  value?: T
  error?: string
  errors?: Record<string, string>
}

export function validateData<T>(schema: Joi.Schema, data: unknown): ValidationResult<T> {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  })

  if (!error) {
    return { isValid: true, value: value as T }
  }

  const fieldErrors: Record<string, string> = {}
  error.details.forEach((detail) => {
    const key = detail.path.join(".")
    fieldErrors[key] = detail.message
  })

  return {
    isValid: false,
    error: error.details[0]?.message || "Validation failed",
    errors: fieldErrors,
  }
}

// ----------------------------------------------------
// 1. Authentication Schemas
// ----------------------------------------------------

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
})

export const passwordComplexitySchema = Joi.string()
  .min(8)
  .pattern(/[A-Z]/, "uppercase letter")
  .pattern(/[0-9]/, "number")
  .required()
  .messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters long.",
    "string.pattern.name": "Password must contain at least one {#name}.",
  })

export const signupSchema = Joi.object({
  first_name: Joi.string().trim().min(1).max(150).required().messages({
    "string.empty": "First name is required.",
  }),
  last_name: Joi.string().trim().min(1).max(150).required().messages({
    "string.empty": "Last name is required.",
  }),
  restaurant_name: Joi.string().trim().min(1).max(150).required().messages({
    "string.empty": "Restaurant name is required.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
    }),
  password: passwordComplexitySchema,
  accept_terms: Joi.boolean().valid(true).required().messages({
    "any.only": "You must accept the terms of service to continue.",
  }),
})

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
    }),
})

export const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
    }),
  token: Joi.string().trim().required().messages({
    "string.empty": "Verification token is required.",
  }),
  new_password: passwordComplexitySchema.messages({
    "string.empty": "New password is required.",
    "string.min": "New password must be at least 8 characters long.",
    "string.pattern.name": "Password must contain at least one {#name}.",
  }),
  confirm_password: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Passwords do not match.",
      "string.empty": "Please confirm your new password.",
    }),
})

// ----------------------------------------------------
// 2. Ingredients & Stock Movement Schemas
// ----------------------------------------------------

export const ingredientSchema = Joi.object({
  name: Joi.string().trim().min(1).max(150).required().messages({
    "string.empty": "Ingredient name is required.",
  }),
  unit: Joi.string().trim().min(1).max(20).required().messages({
    "string.empty": "Measuring unit is required (e.g. kg, L, piece).",
  }),
  low_stock_threshold: Joi.number().min(0).required().messages({
    "number.base": "Low stock threshold must be a valid number.",
    "number.min": "Low stock threshold cannot be negative.",
  }),
  cost_per_unit: Joi.number().min(0).required().messages({
    "number.base": "Unit cost must be a valid number.",
    "number.min": "Unit cost cannot be negative.",
  }),
})

export const stockMovementSchema = Joi.object({
  ingredient: Joi.string().required().messages({
    "string.empty": "Please select an ingredient.",
  }),
  movement_type: Joi.string().valid("in", "out", "waste").required().messages({
    "any.only": "Movement type must be 'in', 'out', or 'waste'.",
  }),
  quantity: Joi.number().positive().required().messages({
    "number.base": "Quantity must be a valid number.",
    "number.positive": "Quantity must be greater than 0.",
  }),
  note: Joi.string().max(255).allow("").optional(),
  client_uuid: Joi.string().allow(null, "").optional(),
})

// ----------------------------------------------------
// 3. Consumables & Purchases Schemas
// ----------------------------------------------------

export const consumableSchema = Joi.object({
  name: Joi.string().trim().min(1).max(150).required().messages({
    "string.empty": "Consumable supply name is required.",
  }),
  category: Joi.string().trim().max(100).allow("").optional(),
})

export const consumablePurchaseSchema = Joi.object({
  consumable: Joi.string().required().messages({
    "string.empty": "Please select a consumable item.",
  }),
  quantity: Joi.number().positive().required().messages({
    "number.positive": "Quantity must be greater than 0.",
  }),
  cost: Joi.number().min(0).required().messages({
    "number.min": "Cost cannot be negative.",
  }),
  purchase_date: Joi.string().isoDate().allow("").optional(),
  note: Joi.string().max(255).allow("").optional(),
})

// ----------------------------------------------------
// 4. Payment Confirmation Schema
// ----------------------------------------------------

export const paymentConfirmationSchema = Joi.object({
  subscription: Joi.string().required().messages({
    "string.empty": "Subscription ID is required.",
  }),
  payer_name: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "Payer name is required.",
    "string.min": "Payer name must be at least 2 characters.",
  }),
  payer_phone: Joi.string()
    .trim()
    .pattern(/^[0-9+ ]{8,20}$/)
    .required()
    .messages({
      "string.empty": "Payer phone number is required.",
      "string.pattern.base": "Please provide a valid phone number (e.g. 0788123456).",
    }),
})
