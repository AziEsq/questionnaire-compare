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
    ? answers.filter((a) => selectedCandidates.includes(a.candidate.name))
    : answers;

  if (filteredAnswers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No answers available for the selected candidates.</p>
        <p className="text-sm mt-2">Try selecting different candidates.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredAnswers.map((answer) => (
        <AnswerCard key={answer.candidate.id} answer={answer} />
      ))}
    </div>
  );
}

function AnswerCard({ answer }: { answer: Answer }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = answer.answer.length > 300;

  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h3 className="font-bold text-lg mb-3 text-gray-900">{answer.candidate.name}</h3>
      <div className="text-gray-700 text-sm leading-relaxed">
        {shouldTruncate && !expanded ? (
          <>
            {answer.answer.substring(0, 300)}...
            <button
              onClick={() => setExpanded(true)}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              Read more
            </button>
          </>
        ) : (
          answer.answer
        )}
        {shouldTruncate && expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="text-blue-600 hover:text-blue-800 ml-1 block mt-2"
          >
            Show less
          </button>
        )}
      </div>
      {answer.source && (
        <a
          href={answer.source}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          View Source →
        </a>
      )}
    </div>
  );
}
