import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const mangadex = new MANGA.MangaDex();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the mangadex provider: check out the provider's website @ https://mangadex.org/",
      routes: [
        '/:query',
        '/info/:id',
        '/read/:chapterId',
        '/random',
        '/recent-added',
        '/latest-updates',
        '/popular'
      ],
      documentation: 'https://docs.consumet.org/#tag/mangadex',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const page = (request.query as { page: number }).page;

    const res = await mangadex.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get('/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = decodeURIComponent((request.params as { id: string }).id);

    try {
      const res = await mangadex
        .fetchMangaInfo(id)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get(
    '/read/:chapterId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const chapterId = (request.params as { chapterId: string }).chapterId;

      try {
        const res = await mangadex.fetchChapterPages(chapterId);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    },
  );

  fastify.get('/random', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const res = await mangadex.fetchRandom();
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/recent-added', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    const limit = (request.query as { limit: number }).limit;

    try {
      const res = await mangadex.fetchRecentlyAdded(page, limit);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/latest-updates', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    const limit = (request.query as { limit: number }).limit;

    try {
      const res = await mangadex.fetchLatestUpdates(page, limit);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/popular', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    const limit = (request.query as { limit: number }).limit;

    try {
      const res = await mangadex.fetchPopular(page, limit);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });
};

export default routes;
