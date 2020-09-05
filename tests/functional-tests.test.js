/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const seedDB = require('./seed');

beforeAll(async () => {
  await seedDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const mockThread = {
  text: 'Test thread text',
  delete_password: 'password',
  reported: false,
  replies: [],
};

const mockReply = {
  text: 'Test reply text',
  delete_password: 'password',
  reported: false,
};

let thread5Id;

describe('Functional Tests', () => {
  describe('API ROUTING FOR /api/threads/:board', () => {
    describe('POST => object with thread data', () => {
      test('Required fields filled in', async () => {
        const response = await request(app).post('/api/threads/general').send({
          text: mockThread.text,
          delete_password: mockThread.delete_password,
        });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(mockThread);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('created_on');
        expect(response.body).toHaveProperty('bumped_on');

        // Save _id for future tests
        mockThread._id = response.body._id;
      });

      test('Missing required field', async () => {
        const response = await request(app)
          .post('/api/threads/general')
          .send({ text: mockThread.text });

        expect(response.status).toBe(400);
      });
    });

    describe('GET => array with 10 most recent bumped threads and 3 most recent replies', () => {
      test('Simple get request', async () => {
        const response = await request(app).get('/api/threads/mockboard');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(10);
        expect(response.body[0]).toHaveProperty('text', 'thread5');
        expect(response.body[0]).not.toHaveProperty('reported');
        expect(response.body[0]).not.toHaveProperty('delete_password');
        expect(response.body[0].replies).toHaveLength(3);

        // Save _id for future tests
        thread5Id = response.body[0]._id;
      });
    });

    describe('PUT => text response with "success" report', () => {
      test('Invalid thread_id', async () => {
        const response = await request(app)
          .put('/api/threads/general')
          .send({ thread_id: '5f516ca9a4cfa812cac2c13e' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'thread not found');
      });

      test('Valid thread_id', async () => {
        const response = await request(app)
          .put('/api/threads/general')
          .send({ thread_id: mockThread._id });

        expect(response.status).toBe(200);
        expect(response.text).toBe('success');
      });
    });

    describe('DELETE => text response with "success" deletion', () => {
      test('Invalid thread_id', async () => {
        const response = await request(app)
          .delete('/api/threads/general')
          .send({ thread_id: '5f516ca9a4cfa812cac2c13e' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'thread not found');
      });

      test('Valid thread_id and Invalid delete_password', async () => {
        const response = await request(app)
          .delete('/api/threads/general')
          .send({
            thread_id: mockThread._id,
            delete_password: '123456',
          });

        expect(response.status).toBe(401);
        expect(response.text).toBe('incorrect password');
      });

      test('Valid thread_id and Valid delete_password', async () => {
        const response = await request(app)
          .delete('/api/threads/general')
          .send({
            thread_id: mockThread._id,
            delete_password: mockThread.delete_password,
          });

        expect(response.status).toBe(200);
        expect(response.text).toBe('success');
      });
    });
  });

  describe('API ROUTING FOR /api/replies/:board', () => {
    describe('POST => object with reply data', () => {
      test('Required fields filled in', async () => {
        const response = await request(app).post('/api/replies/general').send({
          text: mockReply.text,
          delete_password: mockReply.delete_password,
          thread_id: thread5Id,
        });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(mockReply);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('created_on');

        // Save _id for future tests
        mockReply._id = response.body._id;
      });

      test('Missing required field', async () => {
        const response = await request(app).post('/api/replies/general').send({
          text: mockReply.text,
          thread_id: thread5Id,
        });

        expect(response.status).toBe(400);
      });

      test('Invalid thread_id', async () => {
        const response = await request(app).post('/api/replies/general').send({
          text: mockReply.text,
          delete_password: mockReply.delete_password,
          thread_id: '5f516ca9a4cfa812cac2c13e',
        });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'thread not found');
      });
    });

    describe('GET => thread object with all replies', () => {
      test('Valid thread_id', async () => {
        const response = await request(app).get(
          `/api/replies/mockboard?thread_id=${thread5Id}`
        );

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('text', 'thread5');
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('created_on');
        expect(response.body).toHaveProperty('bumped_on');
        expect(response.body).not.toHaveProperty('reported');
        expect(response.body).not.toHaveProperty('delete_password');
        expect(response.body.replies).toHaveLength(6);
      });

      test('Invalid thread_id', async () => {
        const response = await request(app).get(
          `/api/replies/mockboard?thread_id=5f516ca9a4cfa812cac2c13e`
        );

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'thread not found');
      });
    });

    describe('PUT => text response with "success" report', () => {
      test('Invalid reply_id', async () => {
        const response = await request(app).put('/api/replies/general').send({
          thread_id: thread5Id,
          reply_id: '5f516ca9a4cfa812cac2c13e',
        });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'reply not found');
      });

      test('Valid reply_id', async () => {
        const response = await request(app).put('/api/replies/general').send({
          thread_id: thread5Id,
          reply_id: mockReply._id,
        });

        expect(response.status).toBe(200);
        expect(response.text).toBe('success');
      });
    });

    describe('DELETE => text response with "success" deletion', () => {
      test('Invalid reply_id', async () => {
        const response = await request(app)
          .delete('/api/replies/general')
          .send({
            thread_id: thread5Id,
            reply_id: '5f516ca9a4cfa812cac2c13e',
          });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'reply not found');
      });

      test('Valid reply_id and Invalid delete_password', async () => {
        const response = await request(app)
          .delete('/api/replies/general')
          .send({
            thread_id: thread5Id,
            reply_id: mockReply._id,
            delete_password: '12345',
          });

        expect(response.status).toBe(401);
        expect(response.text).toBe('incorrect password');
      });

      test('Valid reply_id and Valid delete_password', async () => {
        const response = await request(app)
          .delete('/api/replies/general')
          .send({
            thread_id: thread5Id,
            reply_id: mockReply._id,
            delete_password: mockReply.delete_password,
          });

        expect(response.status).toBe(200);
        expect(response.text).toBe('success');
      });
    });
  });
});
