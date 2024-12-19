"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_router_1 = __importDefault(require("koa-router"));
const quizRoutes_1 = __importDefault(require("./routes/quizRoutes"));
require("dotenv/config");
const koa2_swagger_ui_1 = require("koa2-swagger-ui");
const swaggerConfig_1 = require("./swaggerConfig");
const quiz_service_1 = __importDefault(require("./services/quiz.service"));
const app = new koa_1.default();
const router = new koa_router_1.default();
if (process.env.NODE_ENV !== "test") {
    // Serve Swagger UI at /docs endpoint
    app.use((0, koa2_swagger_ui_1.koaSwagger)({
        routePrefix: "/docs",
        swaggerOptions: {
            spec: swaggerConfig_1.swaggerSpec,
        },
    }));
}
// Needed for mocking internal server error in service for testing purposes
const quizService = new quiz_service_1.default();
app.context.quizService = quizService; // Attach quizService to app context
// Middleware
app.use((0, koa_body_1.default)());
// Register routes
const routePath = "/quiz";
router.use(routePath, quizRoutes_1.default.routes());
app.use(router.routes()).use(router.allowedMethods());
// Export the app for testing
exports.default = app;
// Start the server
// Can add custom PORT in .env
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.server = server;
