# HAPI Frontend

HAPI is the supply chain and logistics frontend for the Sans Mercantile Constellation.

## Purpose
- Monitor fleet performance, routing efficiency, warehouse status, and logistics analytics.
- Supports API integration and container-based deployment.

## Local Run
```bash
npm install
npm start
```

## API Integration
- Configure API base URL with: `REACT_APP_API_BASE_URL=http://localhost:<backend-port>`
- Health endpoint: `${API_BASE_URL}/api/health`
- Routing endpoint: `${API_BASE_URL}/api/routing`

## Containerization
```bash
docker build -t hapi-frontend .
docker run -p 3002:3000 -e REACT_APP_API_BASE_URL=http://localhost:8004 hapi-frontend
```

## Notes
- Use the environment variable to switch between local and production backends.
- This frontend is ready to be built and deployed inside containers.
