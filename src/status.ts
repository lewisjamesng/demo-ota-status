import _ from 'lodash';

export type UpdateState = 'pending' | 'downloading' | 'installed' | 'failed';

export interface UpdateEvent {
  vehicleId: string;
  release: string;
  state: UpdateState;
  at: string;
}

export interface RolloutSummary {
  release: string;
  total: number;
  counts: Record<UpdateState, number>;
  completionPct: number;
  failedVehicles: string[];
}

const ORDER: UpdateState[] = ['pending', 'downloading', 'installed', 'failed'];

/** Current state per vehicle for one release, using the latest event. */
export function currentState(events: UpdateEvent[], release: string): Record<string, UpdateState> {
  const relevant = _.sortBy(
    events.filter((e) => e.release === release),
    (e) => Date.parse(e.at),
  );
  return _.mapValues(_.keyBy(relevant, 'vehicleId'), 'state');
}

export function summariseRollout(events: UpdateEvent[], release: string): RolloutSummary {
  const states = currentState(events, release);
  const total = _.size(states);
  const counted = _.countBy(_.values(states));
  const counts = _.fromPairs(ORDER.map((s) => [s, counted[s] ?? 0])) as Record<UpdateState, number>;
  const [failed] = _.partition(_.toPairs(states), ([, s]) => s === 'failed');
  return {
    release,
    total,
    counts,
    completionPct: total === 0 ? 0 : _.round((counts.installed / total) * 100, 1),
    failedVehicles: _.sortBy(failed.map(([id]) => id)),
  };
}

export function releases(events: UpdateEvent[]): string[] {
  return _.sortBy(_.uniq(events.map((e) => e.release)));
}
