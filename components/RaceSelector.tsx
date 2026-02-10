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
    <div className="mb-8">
      <label htmlFor="race-select" className="block text-sm font-semibold text-gray-800 mb-3">
        📍 Select Race
      </label>
      <select
        id="race-select"
        value={selectedRace || ''}
        onChange={(e) => updateQuery({ race: e.target.value, candidates: null, q: null })}
        className="w-full px-5 py-3 text-base border-2 border-gray-300 rounded-lg bg-white shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <option value="">Select a race...</option>
        {races.map((race) => (
          <option key={race.id} value={race.key}>
            {race.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}
