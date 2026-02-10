import {
  fetchRaces,
  fetchCandidatesByRace,
  fetchQuestionsByRace,
  fetchAnswersForQuestion,
  fetchTopics,
  fetchOrganizations,
} from '@/lib/airtable';
import RaceSelector from '@/components/RaceSelector';
import CandidateFilter from '@/components/CandidateFilter';
import TopicFilter from '@/components/TopicFilter';
import QuestionNavigator from '@/components/QuestionNavigator';
import AnswerGrid from '@/components/AnswerGrid';
import OrganizationSelector from '@/components/OrganizationSelector';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    race?: string;
    candidates?: string;
    topic?: string;
    org?: string;
    q?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const races = await fetchRaces();
  const selectedRace = params.race || races[0]?.key || null;
  const selectedTopic = params.topic || 'All';
  const selectedOrganization = params.org || null;

  // Fetch data based on selected race
  const candidates = selectedRace ? await fetchCandidatesByRace(selectedRace) : [];
  const questions = selectedRace
    ? await fetchQuestionsByRace(selectedRace, selectedTopic, selectedOrganization || undefined)
    : [];
  const topics = await fetchTopics();
  const organizations = await fetchOrganizations();

  // Parse selected candidates from URL
  const selectedCandidateNames = params.candidates
    ? params.candidates.split(',')
    : candidates.map((c) => c.name);

  // Get current question
  const currentQuestionKey = params.q || questions[0]?.key || null;
  const currentQuestion = questions.find((q) => q.key === currentQuestionKey);

  // Fetch answers for current question
  const answers = currentQuestion
    ? await fetchAnswersForQuestion(currentQuestion.id)
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold mb-3">
            Questionnaire Compare
          </h1>
          <p className="text-blue-100 text-lg">
            Compare candidate responses side-by-side to make informed decisions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-8">
          <RaceSelector races={races} selectedRace={selectedRace} />

          {selectedRace && (
            <>
              <OrganizationSelector
                organizations={organizations}
                selectedOrganization={selectedOrganization}
              />
              <CandidateFilter
                candidates={candidates}
                selectedCandidates={selectedCandidateNames}
              />
              <TopicFilter topics={topics} selectedTopic={selectedTopic} />
            </>
          )}
        </div>

        {selectedRace && questions.length > 0 && (
          <>
            <QuestionNavigator
              questions={questions}
              currentQuestionKey={currentQuestionKey}
            />
            <AnswerGrid
              answers={answers}
              selectedCandidates={selectedCandidateNames}
            />
          </>
        )}
      </div>
    </main>
  );
}
