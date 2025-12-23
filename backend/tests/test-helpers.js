import request from 'supertest';

export const getCsrf = async (app) => {
  const response = await request(app).get('/api/health');
  const cookies = response.headers['set-cookie'] || [];
  const csrfCookie = cookies.find((cookie) => cookie.startsWith('csrf_token='));
  const csrfToken = csrfCookie ? csrfCookie.split(';')[0].split('=')[1] : null;
  return { csrfToken, cookies };
};
