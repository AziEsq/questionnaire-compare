'use client';

import { Answer } from '@/lib/airtable';
import { useState } from 'react';

interface AnswerGridProps {
  answers: Answer[];
  selectedCandidates: string[];
}

export default function AnswerGrid({ answers, selectedCandidates }: AnswerGridProps) {
  // Filter answers to only show selected candidates
  const filteredAnswers = selectedCandidates.length > 0
    ? answers.filter((a) => a.candidate?.name && selectedCandidates.includes(a.candidate.name))
    : answers;

  if (filteredAnswers.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">🗳️</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">No answers available</p>
        <p className="text-sm text-gray-500">Try selecting different candidates to see their responses.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-3xl">💬</span>
        Candidate Responses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnswers.map((answer) => (
          <AnswerCard key={answer.candidate.id} answer={answer} />
        ))}
      </div>
    </div>
  );
}

function AnswerCard({ answer }: { answer: Answer }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = answer.answer.length > 300;

  // Safely get candidate name and initial
  const candidateName = answer.candidate?.name || 'Unknown';
  const candidatePhoto = answer.candidate?.photo;
  const candidateInitial = candidateName.charAt(0).toUpperCase();

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col h-full">
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-3 mb-2">
          {candidatePhoto ? (
            <img
              src={candidatePhoto}
              alt={candidateName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {candidateInitial}
            </div>
          )}
          <h3 className="font-bold text-xl text-gray-900">{candidateName}</h3>
        </div>
      </div>

      <div className="flex-grow text-gray-700 text-base leading-relaxed">
        {shouldTruncate && !expanded ? (
          <>
            {answer.answer.substring(0, 300)}...
            <button
              onClick={() => setExpanded(true)}
              className="text-blue-600 hover:text-blue-800 font-semibold ml-2 inline-flex items-center"
            >
              Read more
            </button>
          </>
        ) : (
          <>
            {answer.answer}
            {shouldTruncate && expanded && (
              <button
                onClick={() => setExpanded(false)}
                className="text-blue-600 hover:text-blue-800 font-semibold ml-2 inline-flex items-center"
              >
                Show less
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
