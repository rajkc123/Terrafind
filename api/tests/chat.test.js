import request from 'supertest';
import app from '../app'; // Adjust the path to your Express app
import prisma from '../lib/prisma.js';

describe('Chat Endpoints', () => {
  let tokenUserId;
  let receiverId;
  let chatId;

  beforeAll(async () => {
    // Create test users in the database
    const user1 = await prisma.user.create({ data: { username: 'user1', avatar: 'avatar1.png' } });
    const user2 = await prisma.user.create({ data: { username: 'user2', avatar: 'avatar2.png' } });

    tokenUserId = user1.id;
    receiverId = user2.id;
  });

  afterAll(async () => {
    // Clean up the database after the tests
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /chats', () => {
    it('should create a new chat', async () => {
      const res = await request(app)
        .post('/chats')
        .send({ receiverId })
        .set('Authorization', `Bearer ${tokenUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.userIDs).toContain(tokenUserId);
      expect(res.body.userIDs).toContain(receiverId);

      chatId = res.body.id; // Save the chat ID for later use
    });
  });

  describe('GET /chats', () => {
    it('should get all chats for the user', async () => {
      const res = await request(app)
        .get('/chats')
        .set('Authorization', `Bearer ${tokenUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /chats/:id', () => {
    it('should get a specific chat and mark it as seen', async () => {
      const res = await request(app)
        .get(`/chats/${chatId}`)
        .set('Authorization', `Bearer ${tokenUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.seenBy).toContain(tokenUserId);
    });
  });

  describe('POST /chats/:id/read', () => {
    it('should mark a chat as read', async () => {
      const res = await request(app)
        .post(`/chats/${chatId}/read`)
        .set('Authorization', `Bearer ${tokenUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.seenBy).toEqual([tokenUserId]);
    });
  });
});
