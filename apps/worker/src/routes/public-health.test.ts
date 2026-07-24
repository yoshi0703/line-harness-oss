import { describe, expect, test } from 'vitest';
import { Hono } from 'hono';
import { health } from './health.js';

describe('GET /api/health', () => {
  test('is public and returns release identity without tenant data', async () => {
    const app = new Hono();
    app.route('/', health);
    const response = await app.request('/api/health');

    expect(response.status).toBe(200);
    const body = await response.json() as {
      status: string;
      releaseVersion: string;
      workerHash: string;
      apiVersion: number;
      [key: string]: unknown;
    };
    expect(body.status).toBe('ok');
    expect(body.releaseVersion).toBe('0.0.0-dev');
    expect(body.workerHash).toMatch(/^sha256:[0-9a-f]{64}$/);
    expect(body.apiVersion).toBe(2);
    expect(body).not.toHaveProperty('accountId');
    expect(body).not.toHaveProperty('databaseId');
  });
});
