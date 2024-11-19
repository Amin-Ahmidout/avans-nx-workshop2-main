import axios from 'axios';

describe('GET /api/meal', () => {
    it('should return info and results', async () => {
        const res = await axios.get(`/api/meal`);

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('info');
        expect(res.data).toHaveProperty('results');
        const results = res.data.results;
        expect(results).toHaveLength(2);
    });

    it('should have expected results', async () => {
        const res = await axios.get(`/api/meal`);

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('info');
        expect(res.data).toHaveProperty('results');
    });
});
