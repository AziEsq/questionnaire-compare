'use client';

import { Question } from '@/lib/airtable';
import { useQueryState } from '@/lib/useQueryState';

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestionKey: string | null;
}

export default function QuestionNavigator({
  questions,
  currentQuestionKey,
}: QuestionNavigatorProps) {
  const { updateQuery } = useQueryState();

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No questions available. Please select a race.
      </div>
    );
  }

  const currentIndex = currentQuestionKey
    ? questions.findIndex((q) => q.key === currentQuestionKey)
    : 0;
  const currentQuestion = questions[currentIndex] || questions[0];

  const goToPrevious = () => {
    if (currentIndex > 0) {
      updateQuery({ q: questions[currentIndex - 1].key });
    }
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      updateQuery({ q: questions[currentIndex + 1].key });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <select
          value={currentQuestion.key}
          onChange={(e) => updateQuery({ q: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {questions.map((question, idx) => (
            <option key={question.key} value={question.key}>
              Q{idx + 1}: {question.question.substring(0, 60)}...
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 uppercase">
            {currentQuestion.topic}
          </span>
          <span className="text-xs text-gray-500">{currentQuestion.organization}</span>
        </div>
        <p className="text-lg font-medium text-gray-900">{currentQuestion.question}</p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
