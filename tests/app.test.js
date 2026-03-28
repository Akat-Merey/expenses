const request = require('supertest');
const app = require('../src/app.js');
const pool = require('../src/db.js');

describe('App routes', () => {
    test('Get /health should return 200 and status ok', async () => {
        const response = await request(app).get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status:'ok',
            message: 'App is running'
        });
    });

    test('POST /expenses should return 400 for invalid data)', async () => {
        const response = await request(app)
        .post('/expenses')
        .send({
            title: '',
            amount: -5,
            category: 'Food'
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            errors: [
                'title is required and must be noot empty',
                'amount must be greater than 0'
            ]
        });
    });

    test('POST /expenses should create a new expense with valid data)', async () => {
        const response = await request(app)
        .post('/expenses')
        .send({
            title: 'Coffee',
            amount: 4.5,
            category: 'Food'
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Coffee');
        expect(response.body.amount).toBe('4.50');
        expect(response.body.category).toBe('Food');
        expect(response.body).toHaveProperty('date');
    });    
});

afterAll(async () => {
    await pool.end();
})