export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Vidora API',
    version: '1.0.0',
    description: 'Sistema de favoritos de vídeos do YouTube'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Desenvolvimento'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/auth/registrar': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuário',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  senha: { type: 'string' }
                },
                required: ['email', 'senha']
              }
            }
          }
        },
        responses: {
          '201': { description: 'Criado' },
          '400': { description: 'Erro' }
        }
      }
    },
    '/auth/entrar': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  senha: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'OK' },
          '401': { description: 'Não autorizado' }
        }
      }
    },
    '/auth/usuario': {
      get: {
        tags: ['Auth'],
        summary: 'Obter usuário',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'OK' },
          '401': { description: 'Não autorizado' }
        }
      }
    },
    '/videos/buscar': {
      get: {
        tags: ['Videos'],
        summary: 'Buscar vídeos',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'pageToken',
            in: 'query',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'OK' }
        }
      }
    },
    '/videos/ids': {
      post: {
        tags: ['Videos'],
        summary: 'Obter vídeos por IDs',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ids: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'OK' }
        }
      }
    },
    '/favoritos': {
      get: {
        tags: ['Favoritos'],
        summary: 'Listar favoritos',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'OK' }
        }
      },
      post: {
        tags: ['Favoritos'],
        summary: 'Adicionar favorito',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  videoId: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Criado' },
          '400': { description: 'Erro' }
        }
      }
    },
    '/favoritos/{videoId}': {
      delete: {
        tags: ['Favoritos'],
        summary: 'Remover favorito',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'videoId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'OK' }
        }
      }
    },
    '/favoritos/{videoId}/verificar': {
      get: {
        tags: ['Favoritos'],
        summary: 'Verificar favorito',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'videoId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'OK' }
        }
      }
    }
  }
};