# demo-ota-status

Update-status service that summarises over-the-air software rollouts across a vehicle fleet. **Synthetic demo repository.** All code and data are fictional sample material for a security-remediation demo.

**Owner:** `@demo-org/vehicle-software-team` (see `.github/CODEOWNERS`)

## What it does

- `currentState`: latest update state per vehicle for a release
- `summariseRollout`: counts per state, completion %, failed vehicles
- `releases`: list of known releases

## Develop

```bash
npm ci
npm run build
npm test
```

## Security scanning

CI runs `npm audit --omit=dev` and `osv-scanner` in the `security-scan` job. Reports are uploaded as artifacts, and the SARIF goes to GitHub code scanning. `osv-scanner.toml` ignores only dev-only Jest tooling.

## Licence

MIT
