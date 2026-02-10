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
      {/* Question counter */}
      <div className="flex items-center gap-3 mb-4">
        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-full text-sm">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Previous/Next buttons */}
      <div className="flex justify-between gap-4 mb-4">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          ← Previous
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === questions.length - 1}
          className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          Next →
        </button>
      </div>

      {/* Question dropdown */}
      <select
        value={currentQuestion.key}
        onChange={(e) => updateQuery({ q: e.target.value })}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium hover:border-blue-400 transition-colors mb-6"
      >
        {questions.map((question, idx) => (
          <option key={question.key} value={question.key}>
            Q{idx + 1}: {question.question.substring(0, 60)}...
          </option>
        ))}
      </select>

      {/* Question card */}
      <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-xl p-8 shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase rounded-full tracking-wide">
            {currentQuestion.topic}
          </span>
          <span className="text-sm text-gray-600 font-medium">{currentQuestion.organization}</span>
        </div>
        <p className="text-xl font-semibold text-gray-900 leading-relaxed">{currentQuestion.question}</p>
      </div>
    </div>
  );
}
