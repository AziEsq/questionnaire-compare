'use client';

import { useQueryState } from '@/lib/useQueryState';

interface OrganizationSelectorProps {
  organizations: string[];
  selectedOrganization: string | null;
  sourceUrl?: string;
}

export default function OrganizationSelector({
  organizations,
  selectedOrganization,
  sourceUrl,
}: OrganizationSelectorProps) {
  const { updateQuery } = useQueryState();

  if (organizations.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="org-select" className="block text-sm font-semibold text-gray-800">
          📋 Select Questionnaire Source
        </label>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            (source)
          </a>
        )}
      </div>
      <select
        id="org-select"
        value={selectedOrganization || ''}
        onChange={(e) => updateQuery({ org: e.target.value || null, q: null })}
        className="w-full px-5 py-3 text-base border-2 border-gray-300 rounded-lg bg-white shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <option value="">All Organizations</option>
        {organizations.map((org) => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </select>
    </div>
  );
}
