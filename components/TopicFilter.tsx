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
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Topic
      </label>
      <div className="flex flex-wrap gap-2">
        {allTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => updateQuery({ topic: topic === 'All' ? null : topic, q: null })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTopic === topic
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
