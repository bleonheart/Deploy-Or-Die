# Deploy or Die

Deploy or Die is a browser-based DevOps strategy game where the player operates a live production platform under changing traffic, failing containers, database pressure and risky releases.

The project is deliberately static so the portfolio demo itself can be hosted for free on GitHub Pages while still demonstrating DevOps concepts through gameplay and repository automation.


## Run locally

Open `index.html` directly, or serve the folder with any static web server.

Python example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this project to the repository root.
3. Use `main` as the default branch.
4. Open `Settings > Pages`.
5. Under `Build and deployment`, set `Source` to `GitHub Actions`.
6. Push to `main` or manually run the `Deploy GitHub Pages` workflow.
7. The deployment URL will appear in the workflow run and in the repository Pages settings.

The workflow is located at `.github/workflows/pages.yml`.

## Suggested portfolio description

Deploy or Die is an interactive SRE and DevOps simulation that turns operational engineering into gameplay. Players manage a production service, react to incidents, scale capacity, perform rollbacks and invest in automation such as health probes, autoscaling, connection pooling and canary deployments. The project is deployed through GitHub Actions to GitHub Pages.

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
        +-- Metrics
        +-- Topology
        +-- Incident feed
        +-- CI/CD panel
        +-- Automation upgrades
```

## Expansion ideas

- Replace simulated telemetry with a real API and Prometheus metrics
- Add a Go backend
- Add Docker and Kubernetes manifests
- Add Terraform for cloud infrastructure
- Add OpenTelemetry traces
- Add Grafana dashboards
- Add k6 load tests
- Add Argo CD or Flux for GitOps
- Add real canary analysis
- Add postmortem generation after each run
- Add multiple regions and failover scenarios
