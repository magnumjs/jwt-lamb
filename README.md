# JWT Protected API with Express + Lambda Function URL

This project uses Express.js, JWT, and serverless-http to run on AWS Lambda using Function URLs.

## Routes

- `POST /login` — gets JWT token.
- `GET /protected` — protected route requiring JWT.

## Deployment

Use the provided GitHub Actions workflow to deploy on push to `main`.
