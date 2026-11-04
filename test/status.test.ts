import { currentState, releases, summariseRollout, UpdateEvent } from '../src/status';

const events: UpdateEvent[] = [
  { vehicleId: 'VH-1', release: 'R1', state: 'downloading', at: '2026-01-01T08:00:00Z' },
  { vehicleId: 'VH-1', release: 'R1', state: 'installed', at: '2026-01-01T09:00:00Z' },
  { vehicleId: 'VH-2', release: 'R1', state: 'failed', at: '2026-01-01T09:00:00Z' },
  { vehicleId: 'VH-3', release: 'R1', state: 'pending', at: '2026-01-01T07:00:00Z' },
  { vehicleId: 'VH-1', release: 'R2', state: 'pending', at: '2026-02-01T07:00:00Z' },
];

describe('OTA status', () => {
  it('uses the latest event per vehicle', () => {
    expect(currentState(events, 'R1')).toEqual({ 'VH-1': 'installed', 'VH-2': 'failed', 'VH-3': 'pending' });
  });

  it('summarises a rollout', () => {
    expect(summariseRollout(events, 'R1')).toEqual({
      release: 'R1',
      total: 3,
      counts: { pending: 1, downloading: 0, installed: 1, failed: 1 },
      completionPct: 33.3,
      failedVehicles: ['VH-2'],
    });
  });

  it('handles an unknown release', () => {
    expect(summariseRollout(events, 'R9').completionPct).toBe(0);
  });

  it('lists releases', () => {
    expect(releases(events)).toEqual(['R1', 'R2']);
  });
});
