<p align="center">
 <strong>Deploy or Die — DevOps & SRE Incident Simulation</strong><br/>
 A browser-based strategy game built around production operations, incident response, reliability, automation, and deployment engineering.<br/>
 Keep the platform alive while traffic grows, services fail, releases break, and infrastructure costs climb.
</p>

<p align="center">
 <a href="https://github.com/bleonheart/Deploy-Or-Die/stargazers">
  <img src="https://img.shields.io/github/stars/bleonheart/Deploy-Or-Die?style=social" alt="GitHub Stars" />
 </a>
 <a href="https://github.com/bleonheart/Deploy-Or-Die/actions/workflows/pages.yml">
  <img src="https://github.com/bleonheart/Deploy-Or-Die/actions/workflows/pages.yml/badge.svg" alt="GitHub Pages" />
 </a>
 <a href="https://bleonheart.github.io/Deploy-Or-Die/">
  <img src="https://img.shields.io/badge/Play-GitHub%20Pages-blue?logo=github" alt="Play on GitHub Pages" />
 </a>
</p>

---

## Overview

Deploy or Die turns DevOps and SRE concepts into an interactive production-operations game.

The player is responsible for a live platform while traffic changes, deployments introduce risk, containers fail, databases come under pressure, and operating costs increase. The goal is not simply to keep the service online, but to improve the platform until common incidents can be detected, mitigated, and recovered from automatically.

The project is intentionally implemented as a lightweight browser application so the playable portfolio demo can be hosted directly on GitHub Pages while the repository demonstrates automated deployment through GitHub Actions.

## Gameplay

The simulation focuses on operational tradeoffs rather than traditional combat or progression.

Players manage areas such as:

- Service replicas and available capacity
- Production traffic and request latency
- Deployment health and rollback decisions
- Database pressure and connection limits
- Incident detection and recovery
- Infrastructure cost
- Reliability and availability
- Automation upgrades
- CI/CD maturity

Incidents can include:

- Sudden traffic spikes
- Container failures
- Risky deployments
- Database saturation
- Increased latency
- Capacity shortages

As the simulation progresses, manual responses can be replaced with automated operational controls.

## DevOps Concepts

The project is designed as a portfolio demonstration of engineering concepts including:

- CI/CD workflows
- GitHub Actions
- GitHub Pages deployments
- Release and rollback strategies
- Horizontal scaling
- Health checks
- Autoscaling
- Incident response
- Reliability engineering
- Observability concepts
- Capacity planning
- Cost management
- Canary deployment concepts
- Infrastructure automation

The current version simulates infrastructure behavior in the browser. The architecture is intentionally extensible toward real services, telemetry, Kubernetes, Terraform, Prometheus, Grafana, and OpenTelemetry.

## Quick Start

Clone the repository:

```bash
git clone https://github.com/bleonheart/Deploy-Or-Die.git
cd Deploy-Or-Die
```

Open `index.html` directly in a browser, or start a local static server:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Live Demo

The GitHub Pages deployment is available at:

https://bleonheart.github.io/Deploy-Or-Die/

Every push to `main` triggers the Pages workflow.

## Deployment

GitHub Pages is deployed through:

```text
.github/workflows/pages.yml
```

The workflow uses two jobs:

```text
Push to main
     |
     v
   Build
     |
     +-- Checkout repository
     +-- Configure GitHub Pages
     +-- Upload github-pages artifact
     |
     v
  Deploy
     |
     +-- Download deployment artifact
     +-- Publish to GitHub Pages
```

The deployment job depends on the build job so the Pages artifact is fully available before deployment begins.

## Architecture

```text
Browser
  |
  +-- Simulation Engine
  |     +-- Traffic model
  |     +-- Incident scheduler
  |     +-- Reliability model
  |     +-- Cost model
  |
  +-- Operations Dashboard
        +-- Service metrics
        +-- Infrastructure topology
        +-- Incident feed
        +-- CI/CD controls
        +-- Automation upgrades
```

The application is currently fully static and requires no backend services.

## Project Structure

```text
Deploy-Or-Die/
├── .github/
│   └── workflows/
│       └── pages.yml
├── assets/
│   ├── app.js
│   └── style.css
├── index.html
└── README.md
```

## Roadmap

Planned extensions include:

- Go service backend
- Docker containerization
- Kubernetes deployment manifests
- Terraform infrastructure
- Prometheus metrics
- Grafana dashboards
- OpenTelemetry traces
- k6 load testing
- Argo CD or Flux GitOps
- Real canary analysis
- Multi-region failover scenarios
- Automated incident postmortems
- Persistent player progression
- More advanced chaos-engineering events

## Contributing

Contributions and experiments are welcome.

1. Fork the repository
2. Create a feature branch
3. Make and test the changes
4. Keep changes focused and compatible with the existing simulation
5. Open a pull request with a clear description

---
