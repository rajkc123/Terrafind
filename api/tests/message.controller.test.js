import request from 'supertest';
import app from '../app'; // Adjust the path to your Express app
import prisma from '../lib/prisma.js';

describe('POST /chats/:chatId/messages', () => {
  let chatId;
  let tokenUserId;
  let receiverId;

  beforeAll(async () => {
    // Create test users in the database
    const user1 = await prisma.user.create({ data: { username: 'user1', avatar: 'avatar1.png' } });
    const user2 = await prisma.user.create({ data: { username: 'user2', avatar: 'avatar2.png' } });

    tokenUserId = user1.id;
    receiverId = user2.id;

    // Create a chat between the users
    const chat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
      },
    });

    chatId = chat.id; // Save the chat ID for later use
  });

  afterAll(async () => {
    // Clean up the database after the tests
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should add a message to the chat', async () => {
    const messageText = 'Hello, this is a test message';

    const res = await request(app)
      .post(`/chats/${chatId}/messages`)
      .send({ text: messageText })
      .set('Authorization', `Bearer ${tokenUserId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toEqual(messageText);
    expect(res.body.chatId).toEqual(chatId);
    expect(res.body.userId).toEqual(tokenUserId);

    // Check if the lastMessage and seenBy fields were updated
    const updatedChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    expect(updatedChat.lastMessage).toEqual(messageText);
    expect(updatedChat.seenBy).toContain(tokenUserId);
  });

  it('should return 404 if chat is not found or user is not part of the chat', async () => {
    const nonExistentChatId = 'non-existent-chat-id';

    const res = await request(app)
      .post(`/chats/${nonExistentChatId}/messages`)
      .send({ text: 'This should fail' })
      .set('Authorization', `Bearer ${tokenUserId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Chat not found!');
  });
});
