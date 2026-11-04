import { createServer } from 'node:http';
import { releases, summariseRollout, UpdateEvent } from './status';

// Synthetic sample events, for demo purposes only.
const events: UpdateEvent[] = [
  { vehicleId: 'VH-001', release: '2026.03.1', state: 'installed', at: '2026-03-02T10:00:00Z' },
  { vehicleId: 'VH-002', release: '2026.03.1', state: 'failed', at: '2026-03-02T10:05:00Z' },
  { vehicleId: 'VH-003', release: '2026.03.1', state: 'downloading', at: '2026-03-02T10:07:00Z' },
];

const port = Number(process.env.PORT ?? 3002);
createServer((_req, res) => {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(releases(events).map((r) => summariseRollout(events, r))));
}).listen(port, () => console.log(`demo-ota-status listening on :${port}`));
