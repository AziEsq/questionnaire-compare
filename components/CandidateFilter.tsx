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
    <div className="mb-8 pb-8 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-semibold text-gray-800">
          👥 Select Candidates
        </label>
        <div className="space-x-3">
          <button
            onClick={selectAll}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {candidates.map((candidate) => (
          <label
            key={candidate.id}
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedCandidates.includes(candidate.name)
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedCandidates.includes(candidate.name)}
              onChange={() => toggleCandidate(candidate.name)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            />
            <span className="text-sm font-medium text-gray-900">{candidate.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
