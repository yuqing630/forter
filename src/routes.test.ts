import request from 'supertest';
import app from './routes';

describe('API Tests', () => {
    it('should return country name for a valid IP address from ipstack', async () => {
        const ip = '8.8.8.8';
        const res = await request(app).get(`/api/ip-to-country/${ip}`);
        expect(res.status).toBe(200);
        expect(res.body.country).toBe('United States');
    });

    it('should return country name for a valid IP address from ipapi', async () => {
        const ip = '8.8.4.4';
        const res = await request(app).get(`/api/ip-to-country/${ip}`);
        expect(res.status).toBe(200);
        expect(res.body.country).toBe('United States');
    });

    it('should return an error for an invalid IP address', async () => {
        const ip = 'invalid_ip';
        const res = await request(app).get(`/api/ip-to-country/${ip}`);
        expect(res.status).toBe(400);
    });
});
