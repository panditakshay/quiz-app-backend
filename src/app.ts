import Koa from 'koa';
import bodyParser from 'koa-body';
import Router from 'koa-router';
import quizRoutes from './routes/quizRoutes';
import 'dotenv/config';
import { koaSwagger } from 'koa2-swagger-ui';
import { swaggerSpec } from './swaggerConfig';
import QuizService from './services/quiz.service';

const app = new Koa();
const router = new Router();

if (process.env.NODE_ENV !== 'test') {
  // Serve Swagger UI at /docs endpoint
  app.use(
    koaSwagger({
      routePrefix: '/docs', 
      swaggerOptions: {
        spec: swaggerSpec as Record<string, any>,
      },
    })
  );
}

// Needed for mocking internal server error in service for testing purposes
const quizService = new QuizService();
app.context.quizService = quizService; // Attach quizService to app context

// Middleware
app.use(bodyParser());

// Register routes
const routePath = '/quiz';
router.use(routePath, quizRoutes.routes());
app.use(router.routes()).use(router.allowedMethods());

// Export the app for testing
export default app;

// Start the server
// Can add custom PORT in .env
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server };
