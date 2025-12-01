# Frontend Performance Testing with k6

This project uses [k6](https://k6.io/) to test the performance of the Next.js API routes.

## Prerequisites

1.  **Install k6**: [Official Docs](https://grafana.com/docs/k6/latest/set-up/install-k6/)
2.  **Grafana Cloud Account**: [Sign up](https://grafana.com/products/cloud/k6/)

## Running Tests Locally

1.  **Start the Backend**:
    The frontend API routes (`/api/employees`) proxy requests to the backend. Ensure `dogo-onsen-backend` is running on `http://localhost:8000`.

2.  **Start the Frontend**:

    ```bash
    npm run build
    npm start
    ```

3.  **Run k6**:
    ```bash
    k6 run tests/performance/load-test.js
    ```

## CI/CD Integration

The GitHub Actions workflow (`.github/workflows/performance-tests.yml`) builds and starts the Next.js app before running k6.

**Note**: The current CI workflow does _not_ spin up the backend service. For accurate results in CI, you may need to configure the workflow to start the backend or mock the backend responses.

**Secrets Required:**

- `K6_CLOUD_TOKEN`
- `K6_CLOUD_PROJECT_ID`
