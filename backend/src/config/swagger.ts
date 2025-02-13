import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Journey of Knowledge',
      version: '1.0.0',
      description: 'Documentação da API usando Swagger e TypeScript',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://jok.api:3000/api',
        description: 'Servidor de Produção',
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'], // Caminho para os arquivos de rotas
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
