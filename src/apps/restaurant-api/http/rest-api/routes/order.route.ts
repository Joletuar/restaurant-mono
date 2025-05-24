import { FastifyInstance } from 'fastify';

const orderRoutes = async (
  fastify: FastifyInstance,
  options: Object
): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });
};

export default orderRoutes;
