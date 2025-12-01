import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  scenarios: {
    read_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 }, // Ramp up to 10 users
        { duration: '1m', target: 10 }, // Stay at 10 users
        { duration: '30s', target: 0 }, // Ramp down
      ],
      exec: 'readEmployees',
    },
    write_load: {
      executor: 'constant-vus',
      vus: 5,
      duration: '2m',
      exec: 'createEmployee',
    },
  },
  thresholds: {
    // RNF-001: Latencia en Lecturas p95 <= 300 ms
    'http_req_duration{type:read}': ['p(95)<300'],
    // RNF-002: Latencia en Escrituras ligeras p95 <= 400 ms
    'http_req_duration{type:write}': ['p(95)<400'],
    // RNF-003: Tiempo de carga UI (API portion)
    // Note: Full UI load time requires browser testing. This checks the API latency contribution.
    http_req_duration: ['p(95)<800'],
    // General failure rate
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export function readEmployees() {
  const res = http.get(`${BASE_URL}/api/employees`, {
    tags: { type: 'read' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

export function createEmployee() {
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
    'status is 201': (r) => r.status === 201,
  });

  sleep(2);
}
