const request = require('supertest');
const app = require('../app');

describe('JWT Auth API', () => {
  let token;

  it('should login and receive a JWT', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'pass' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should access protected route with token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/protected/i);
  });

  it('should reject access to protected route without token', async () => {
    const res = await request(app)
      .get('/protected');

    expect(res.statusCode).toBe(401);
  });

  it('should reject access with invalid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toBe(401);
  });
});

describe('JWT Protected API', () => {
  it('should return a token on POST /login', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'testuser' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should deny access to /protected without token', async () => {
    const res = await request(app).get('/protected');
    expect(res.statusCode).toBe(401);
  });

  it('should allow access to /protected with valid token', async () => {
    const loginRes = await request(app)
      .post('/login')
      .send({ username: 'testuser' });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe('testuser');
  });
});