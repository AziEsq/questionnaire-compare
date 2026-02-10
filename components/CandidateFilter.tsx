'use client';

import { Candidate } from '@/lib/airtable';
import { useQueryState } from '@/lib/useQueryState';

interface CandidateFilterProps {
  candidates: Candidate[];
  selectedCandidates: string[];
}

export default function CandidateFilter({
  candidates,
  selectedCandidates,
}: CandidateFilterProps) {
  const { updateQuery } = useQueryState();

  const toggleCandidate = (candidateName: string) => {
    const newSelection = selectedCandidates.includes(candidateName)
      ? selectedCandidates.filter((c) => c !== candidateName)
      : [...selectedCandidates, candidateName];

    updateQuery({ candidates: newSelection.length > 0 ? newSelection : null });
  };

  const selectAll = () => {
    updateQuery({ candidates: candidates.map((c) => c.name) });
  };

  const clearAll = () => {
    updateQuery({ candidates: null });
  };

  if (candidates.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Candidates
        </label>
        <div className="space-x-2">
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {candidates.map((candidate) => (
          <label
            key={candidate.id}
            className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCandidates.includes(candidate.name)}
              onChange={() => toggleCandidate(candidate.name)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{candidate.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
