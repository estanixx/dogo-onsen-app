import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

/**
 * Performance Tests para Dogo Onsen Frontend API Routes
 *
 * Requisitos No Funcionales cubiertos:
 * - RNF-001: Latencia en Lecturas p95 ≤ 300 ms
 * - RNF-002: Latencia en Escrituras ligeras p95 ≤ 400 ms
 * - RNF-003: Tiempo de respuesta API < 800 ms
 */

export const options = {
  ext: {
    loadimpact: {
      projectID: 6059886, // REPLACE THIS with your actual Project ID
      name: 'Dogo Onsen Perf', // Name of the test run in the UI
    },
  },
  scenarios: {
    // Escenario 1: Lecturas (RNF-001)
    read_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 }, // Ramp up to 10 users
        { duration: '1m', target: 10 }, // Stay at 10 users
        { duration: '30s', target: 0 }, // Ramp down
      ],
      exec: 'readEndpoints',
    },
    // Escenario 2: Escrituras ligeras (RNF-002)
    write_load: {
      executor: 'constant-vus',
      vus: 5,
      duration: '2m',
      exec: 'writeEndpoints',
    },
  },
  thresholds: {
    // RNF-001: Latencia en Lecturas p95 <= 300 ms
    'http_req_duration{type:read}': ['p(95)<300'],
    // RNF-002: Latencia en Escrituras ligeras p95 <= 400 ms
    'http_req_duration{type:write}': ['p(95)<400'],
    // RNF-003: Tiempo de respuesta general API
    http_req_duration: ['p(95)<800'],
    // General failure rate
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// ==================== LECTURAS (RNF-001) ====================

export function readEndpoints() {
  group('Frontend API Read Operations', () => {
    // Leer empleados via Next.js API route
    const empRes = http.get(`${BASE_URL}/api/employees`, {
      tags: { type: 'read', endpoint: 'employees' },
    });

    check(empRes, {
      'employees status 200': (r) => r.status === 200,
    });

    sleep(1);
  });
}

// ==================== ESCRITURAS (RNF-002) ====================

export function writeEndpoints() {
  group('Frontend API Write Operations', () => {
    const clerkId = `test_fe_${randomString(8)}`;
    const payload = JSON.stringify({
      clerkId: clerkId,
      firstName: 'Frontend',
      lastName: 'Tester',
      email: `${clerkId}@example.com`,
      estado: 'pendiente',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { type: 'write' },
    };

    const res = http.post(`${BASE_URL}/api/employees`, payload, params);

    check(res, {
      'create employee status 201': (r) => r.status === 201,
    });

    sleep(2);
  });
}
