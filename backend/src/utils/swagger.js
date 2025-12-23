import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lotus AIT API',
      version: '1.0.0',
      description: `
# Lotus × Bérard AIT Sound Lab API

REST API for the Lotus AIT clinical platform.

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Rate Limiting

- API endpoints: 100 requests per minute
- Auth endpoints: 5 requests per minute
- Uploads: 5 requests per 5 minutes

## Roles

| Role | Description |
|------|-------------|
| guest | Unauthenticated user |
| patient | Registered patient |
| parent | Parent/guardian |
| clinician | Healthcare provider |
| school_admin | School administrator |
| super_admin | System administrator |
      `,
      contact: {
        name: 'Lotus AIT Support',
        email: 'support@lotusait.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
      {
        url: 'https://api.lotusait.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            name: { type: 'string', example: 'أحمد محمد' },
            nameEn: { type: 'string', example: 'Ahmed Mohammed' },
            role: {
              type: 'string',
              enum: ['guest', 'patient', 'parent', 'clinician', 'school_admin', 'super_admin'],
            },
            phone: { type: 'string', example: '+966500000000' },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            name: { type: 'string' },
            phone: { type: 'string' },
          },
        },
        ClinicalProgress: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            sessionsCompleted: { type: 'integer', example: 8 },
            totalSessions: { type: 'integer', example: 20 },
            treatmentPhase: {
              type: 'string',
              enum: ['assessment', 'active', 'maintenance', 'completed'],
            },
            metrics: {
              type: 'object',
              properties: {
                attention: { type: 'number', example: 75 },
                processingSpeed: { type: 'number', example: 70 },
                auditoryDiscrimination: { type: 'number', example: 80 },
              },
            },
          },
        },
        Session: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            type: {
              type: 'string',
              enum: ['attention', 'frequency', 'sequencing', 'questionnaire'],
            },
            completedAt: { type: 'string', format: 'date-time' },
            duration: { type: 'number', example: 20 },
            score: { type: 'number', example: 85 },
            results: {
              type: 'object',
              properties: {
                correctResponses: { type: 'integer' },
                totalTrials: { type: 'integer' },
                reactionTime: { type: 'number' },
                accuracy: { type: 'number' },
              },
            },
          },
        },
        Gamification: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            totalPoints: { type: 'integer', example: 1500 },
            level: { type: 'integer', example: 4 },
            achievements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  unlockedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            streakDays: { type: 'integer', example: 7 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'integer' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            pages: { type: 'integer' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: { type: 'string' },
                        message: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Clinical', description: 'Clinical progress tracking' },
      { name: 'Sessions', description: 'Assessment sessions' },
      { name: 'Gamification', description: 'Achievements and progress' },
      { name: 'Settings', description: 'User settings' },
      { name: 'Admin', description: 'Admin operations' },
      { name: 'Sync', description: 'Data synchronization' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

// Route documentation
export const swaggerRoutes = `
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * @swagger
 * /clinical/progress/{userId}:
 *   get:
 *     tags: [Clinical]
 *     summary: Get user's clinical progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clinical progress data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClinicalProgress'
 *
 * @swagger
 * /sessions:
 *   post:
 *     tags: [Sessions]
 *     summary: Save assessment session
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       201:
 *         description: Session saved
 *
 * @swagger
 * /sessions/history/{userId}:
 *   get:
 *     tags: [Sessions]
 *     summary: Get user's session history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Session history
 *
 * @swagger
 * /gamification/state/{userId}:
 *   get:
 *     tags: [Gamification]
 *     summary: Get user's gamification state
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gamification state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gamification'
 *
 * @swagger
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User list with pagination
 *
 * @swagger
 * /sync:
 *   post:
 *     tags: [Sync]
 *     summary: Sync offline data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actions:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Sync completed
 */
`;

export default swaggerSpec;
