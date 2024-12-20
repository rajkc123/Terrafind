import request from 'supertest';
import app from '../app'; // Adjust the path to your Express app
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

describe('Post Endpoints', () => {
  let tokenUserId;
  let token;
  let postId;

  beforeAll(async () => {
    // Create test users in the database
    const user = await prisma.user.create({ data: { username: 'user1', avatar: 'avatar1.png' } });
    tokenUserId = user.id;

    // Generate a JWT token for the user
    token = jwt.sign({ id: tokenUserId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  });

  afterAll(async () => {
    // Clean up the database after the tests
    await prisma.postDetail.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /posts', () => {
    it('should get all posts based on query parameters', async () => {
      const res = await request(app)
        .get('/posts')
        .query({ city: 'Test City', type: 'Apartment', minPrice: 100, maxPrice: 1000 });

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('GET /posts/:id', () => {
    beforeAll(async () => {
      // Create a post for the test
      const post = await prisma.post.create({
        data: {
          city: 'Test City',
          type: 'Apartment',
          userId: tokenUserId,
          postDetail: {
            create: { description: 'Test Description' },
          },
        },
      });
      postId = post.id;
    });

    it('should get a single post by ID with saved status if logged in', async () => {
      const res = await request(app)
        .get(`/posts/${postId}`)
        .set('Cookie', `token=${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', postId);
      expect(res.body).toHaveProperty('isSaved', false); // Since we didn't save the post
    });

    it('should get a single post by ID without saved status if not logged in', async () => {
      const res = await request(app)
        .get(`/posts/${postId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', postId);
      expect(res.body).toHaveProperty('isSaved', false); // Since we're not logged in
    });
  });

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const newPostData = {
        postData: {
          city: 'Test City',
          type: 'House',
        },
        postDetail: {
          description: 'Test Description for new post',
        },
      };

      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${tokenUserId}`)
        .send(newPostData);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('city', 'Test City');
      expect(res.body).toHaveProperty('type', 'House');
      postId = res.body.id; // Save the post ID for later use
    });
  });

  describe('PUT /posts/:id', () => {
    it('should update an existing post', async () => {
      const updatedData = { city: 'Updated City' };

      const res = await request(app)
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${tokenUserId}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(200);

      const updatedPost = await prisma.post.findUnique({ where: { id: postId } });
      expect(updatedPost.city).toEqual('Updated City');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post', async () => {
      const res = await request(app)
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${tokenUserId}`);

      expect(res.statusCode).toEqual(200);

      const deletedPost = await prisma.post.findUnique({ where: { id: postId } });
      expect(deletedPost).toBeNull();
    });

    it('should return 403 if trying to delete a post that does not belong to the user', async () => {
      const anotherUser = await prisma.user.create({ data: { username: 'user2', avatar: 'avatar2.png' } });

      const post = await prisma.post.create({
        data: {
          city: 'Another City',
          type: 'Condo',
          userId: anotherUser.id,
          postDetail: {
            create: { description: 'Another Description' },
          },
        },
      });

      const res = await request(app)
        .delete(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${tokenUserId}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toEqual('Not Authorized!');
    });
  });
});
