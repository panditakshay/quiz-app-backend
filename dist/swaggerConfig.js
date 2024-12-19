"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
/**
 * Swagger definition with general API metadata
 */
const swaggerDefinition = {
    openapi: "3.0.0", // OpenAPI 3.0 specification
    info: {
        title: "Quiz API", // API title
        version: "1.0.0", // API version
        description: "A simple API to manage and execute quizzes", // API description
    },
    basePath: "/", // Base path for all endpoints
};
/**
 * Options for swagger-jsdoc to generate the API documentation
 */
const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.ts"], // Path to route files with Swagger annotations
};
// Generate the Swagger specification
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
