import {
  fetchRaces,
  fetchCandidatesByRace,
  fetchQuestionsByRace,
  fetchAnswersForQuestion,
  fetchTopics,
} from '@/lib/airtable';
import RaceSelector from '@/components/RaceSelector';
import CandidateFilter from '@/components/CandidateFilter';
import TopicFilter from '@/components/TopicFilter';
import QuestionNavigator from '@/components/QuestionNavigator';
import AnswerGrid from '@/components/AnswerGrid';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    race?: string;
    candidates?: string;
    topic?: string;
    q?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const races = await fetchRaces();
  const selectedRace = params.race || races[0]?.name || null;
  const selectedTopic = params.topic || 'All';

  // Fetch data based on selected race
  const candidates = selectedRace ? await fetchCandidatesByRace(selectedRace) : [];
  const questions = selectedRace
    ? await fetchQuestionsByRace(selectedRace, selectedTopic)
    : [];
  const topics = await fetchTopics();

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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Questionnaire Compare
          </h1>
          <p className="text-gray-600">
            Compare candidate responses side-by-side
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <RaceSelector races={races} selectedRace={selectedRace} />

          {selectedRace && (
            <>
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
