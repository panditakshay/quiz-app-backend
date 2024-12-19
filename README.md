# **Quiz Service API**

This project provides a RESTful API for creating quizzes, submitting answers, and retrieving results. It is containerized using Docker and can be run locally with **Docker Compose**.

---

## **Setup Instructions**

Follow the steps below to set up and run the service:

### **1. Prerequisites**

- Install **Docker** and **Docker Compose** on your machine.
  - [Docker Installation Guide](https://docs.docker.com/get-docker/)
  - [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

### **2. Clone the Repository**

   ```bash
   git clone <your-repository-url>
   cd <your-repository-folder>
   ```

### **3. Start the Service**

   Run the following command in the project root directory:

   ```bash
   docker-compose up
   ```

   This will:

- Build the Docker image.
- Start the service on port `3000`.

### **4. Access the Service**

- The API will be available at: **`http://localhost:3000/docs`**

### **5. Stop the Service**

   To stop the running service, press `Ctrl+C` in the terminal or run:

   ```bash
   docker-compose down
   ```

---

## **Docker Configuration**

### **Dockerfile**

The `Dockerfile` uses Node.js LTS (Alpine) as the base image and performs the following steps:

1. Installs dependencies using `npm install`.
2. Builds TypeScript code with `npm run build`.
3. Exposes port `3000` for the service.
4. Starts the server using `npm start`.

```dockerfile
# Use Node.js LTS version as the base image
FROM node:lts-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the application files
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
```

---

### **docker-compose.yml**

The `docker-compose.yml` file defines the services, ports, and volumes required to run the application in development mode.

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    command: npm run dev
```

---

## **API Endpoints**

The following endpoints are available in the Quiz Service API:

| **Method** | **Endpoint**            | **Description**                     |
|------------|-------------------------|-------------------------------------|
| **POST**   | `/quiz`                 | Create a new quiz.                  |
| **GET**    | `/quiz/:quizId`         | Retrieve quiz details (no answers). |
| **POST**   | `/quiz/:quizId/answer`  | Submit an answer for a quiz.        |
| **GET**    | `/quiz/score/:userId`    | Retrieve quiz results for a user.   |

---

## **Known Issues / Limitations**

1. **In-Memory Database**:
   - The service uses an in-memory database (`Map`) for storing quizzes and user attempts.
   - All data will be lost when the service restarts.

2. **Scalability**:
   - Since the service runs in a single container, it may not scale effectively under heavy load.

3. **Data Persistence**:
   - No persistent storage is implemented. For production use, integrate a database like MongoDB or PostgreSQL.

4. **Input Validation**:
   - While basic validation is in place, more advanced checks (e.g., schema validation with libraries like `Joi` or `Zod`) are not implemented.

---

## **Future Improvements**

- Integrate a persistent database (e.g., MongoDB, PostgreSQL).
- Add authentication and authorization for users.
- Improve input validation and error handling.
- Implement unit tests for all core functionalities.

---

## **Contact**

If you encounter any issues or have questions, please reach out to me at:

- **Email**: <akshaycpandit19@gmail.com>
- **GitHub**: <https://github.com/panditakshay>

---

## **License**

This project is licensed under the **MIT License**.
