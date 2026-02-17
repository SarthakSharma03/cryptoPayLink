"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonResponse = void 0;
const jsonResponse = (res, payload, status = 200) => {
    return res.status(status).json(payload);
};
exports.jsonResponse = jsonResponse;
