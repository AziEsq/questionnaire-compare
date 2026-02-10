'use client';

import { Race } from '@/lib/airtable';
import { useQueryState } from '@/lib/useQueryState';

interface RaceSelectorProps {
  races: Race[];
  selectedRace: string | null;
}

export default function RaceSelector({ races, selectedRace }: RaceSelectorProps) {
  const { updateQuery } = useQueryState();

  return (
    <div className="mb-6">
      <label htmlFor="race-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Race
      </label>
      <select
        id="race-select"
        value={selectedRace || ''}
        onChange={(e) => updateQuery({ race: e.target.value, candidates: null, q: null })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a race...</option>
        {races.map((race) => (
          <option key={race.id} value={race.name}>
            {race.name}
          </option>
        ))}
      </select>
    </div>
  );
}
