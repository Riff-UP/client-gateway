"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
const joi = __importStar(require("joi"));
require("dotenv/config");
const envSchema = joi
    .object({
    PORT: joi.number().required(),
    TCP_PORT: joi.number().required(),
    CONTENT_MS_HOST: joi.string().required(),
    MONGO_URI: joi.string().required(),
    RABBIT_URL: joi.string().required(),
    R2_ENDPOINT: joi.string().required(),
    R2_ACCESS_KEY: joi.string().required(),
    R2_SECRET_KEY: joi.string().required(),
    R2_BUCKET: joi.string().required(),
    R2_PUBLIC_URL: joi.string().required(),
})
    .unknown(true);
const { error, value } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const envVars = value;
exports.envs = {
    port: envVars.PORT,
    tcpPort: envVars.TCP_PORT,
    host: process.env.CONTENT_MS_HOST || '0.0.0.0',
    mongoUri: envVars.MONGO_URI,
    rabbitUrl: envVars.RABBIT_URL,
    r2: {
        endpoint: envVars.R2_ENDPOINT,
        accessKey: envVars.R2_ACCESS_KEY,
        secretKey: envVars.R2_SECRET_KEY,
        bucket: envVars.R2_BUCKET,
        publicUrl: envVars.R2_PUBLIC_URL,
    },
};
//# sourceMappingURL=envs.js.map