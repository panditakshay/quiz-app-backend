import swaggerJSDoc from "swagger-jsdoc";

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
const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };
