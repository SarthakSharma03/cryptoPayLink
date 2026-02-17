"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const jsonResponse_1 = require("./jsonResponse");
const validateBody = (rules) => {
    return (req, res, next) => {
        const errors = [];
        const body = req.body ?? {};
        for (const rule of rules) {
            const value = body[rule.key];
            if (value === undefined || value === null) {
                errors.push(`${rule.key} is required`);
                continue;
            }
            if (rule.type) {
                const actualType = typeof value;
                if (actualType !== rule.type) {
                    errors.push(`${rule.key} must be ${rule.type}`);
                    continue;
                }
            }
            if (rule.type === "string" && rule.minLength && String(value).trim().length < rule.minLength) {
                errors.push(`${rule.key} is too short`);
            }
        }
        if (errors.length) {
            return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid request body", errors }, 400);
        }
        next();
    };
};
exports.validateBody = validateBody;
