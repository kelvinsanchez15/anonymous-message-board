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
  text: 'Test text',
  delete_password: 'password',
  reported: false,
  replies: [],
};

describe('Functional Tests', () => {
  describe('API ROUTING FOR /api/threads/:board', () => {
    describe('POST => object with thread data', () => {
      test('Required fields filled in', async () => {
        const response = await request(app).post('/api/threads/general').query({
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
          .query({ text: mockThread.text });

        expect(response.status).toBe(400);
      });
    });

    describe('GET => array with 10 most recent bumped threads and 3 most recent replies', () => {
      test('Simple get request', async () => {
        const response = await request(app).get('/api/threads/mockboard');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(10);
        expect(response.body[0]).toHaveProperty('text', 'thread5');
        expect(response.body[0].replies).toHaveLength(3);
      });
    });

    describe('PUT => text response with "success" report', () => {
      test('Invalid thread_id', async () => {
        const response = await request(app)
          .put('/api/threads/general')
          .query({ thread_id: '5f516ca9a4cfa812cac2c13e' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'thread not found');
      });

      test('Valid thread_id', async () => {
        const response = await request(app)
          .put('/api/threads/general')
          .query({ thread_id: mockThread._id });

        expect(response.status).toBe(200);
        expect(response.text).toBe('success');
      });
    });

    describe('DELETE => text response with "success" deletion', () => {
      test('Invalid thread_id', async () => {
        const response = await request(app)
          .delete('/api/threads/general')
          .query({ thread_id: '5f516ca9a4cfa812cac2c13e' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'thread not found');
      });

      test('Valid thread_id and Invalid delete_password', async () => {
        const response = await request(app)
          .delete('/api/threads/general')
          .query({
            thread_id: mockThread._id,
            delete_password: '123456',
          });

        expect(response.status).toBe(401);
        expect(response.text).toBe('incorrect password');
      });

      test('Valid thread_id and Valid delete_password', async () => {
        const response = await request(app)
          .delete('/api/threads/general')
          .query({
            thread_id: mockThread._id,
            delete_password: mockThread.delete_password,
          });

        expect(response.status).toBe(200);
        expect(response.text).toBe('success');
      });
    });
  });

  describe('API ROUTING FOR /api/replies/:board', () => {
    describe('POST', () => {});

    describe('GET', () => {});

    describe('PUT', () => {});

    describe('DELETE', () => {});
  });
});
