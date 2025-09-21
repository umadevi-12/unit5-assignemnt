const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dish Booking System API',
      version: '1.0.0',
      description: 'API documentation for Dish Booking System (Auth, Dishes, Orders, Password Reset)'
    },
    servers: [
      { url: process.env.SWAGGER_SERVER_URL || 'http://localhost:5000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js', './server.js'] 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
