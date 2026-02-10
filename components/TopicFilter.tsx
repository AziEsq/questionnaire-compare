'use client';

import { useQueryState } from '@/lib/useQueryState';

interface TopicFilterProps {
  topics: string[];
  selectedTopic: string;
}

export default function TopicFilter({ topics, selectedTopic }: TopicFilterProps) {
  const { updateQuery } = useQueryState();

  const allTopics = ['All', ...topics];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        🏷️ Filter by Topic
      </label>
      <div className="flex flex-wrap gap-3">
        {allTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => updateQuery({ topic: topic === 'All' ? null : topic, q: null })}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              selectedTopic === topic
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
