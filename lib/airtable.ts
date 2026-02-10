import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

export interface Race {
  id: string;
  name: string;
}

export interface Candidate {
  id: string;
  name: string;
  race: string;
}

export interface Question {
  id: string;
  key: string;
  question: string;
  topic: string;
  organization: string;
  race: string;
}

export interface Answer {
  candidate: {
    id: string;
    name: string;
  };
  answer: string;
  source?: string;
}

// Fetch all races
export async function fetchRaces(): Promise<Race[]> {
  try {
    const records = await base('Races').select().all();
    return records.map(record => ({
      id: record.id,
      name: record.fields.Name as string,
    }));
  } catch (error) {
    console.error('Error fetching races:', error);
    throw new Error('Failed to fetch races from Airtable');
  }
}

// Fetch candidates for a specific race
export async function fetchCandidatesByRace(raceName: string): Promise<Candidate[]> {
  try {
    const records = await base('Candidates')
      .select({
        filterByFormula: `{Race} = '${raceName}'`,
      })
      .all();

    return records.map(record => ({
      id: record.id,
      name: record.fields.Name as string,
      race: raceName,
    }));
  } catch (error) {
    console.error(`Error fetching candidates for race "${raceName}":`, error);
    throw new Error(`Failed to fetch candidates for race: ${raceName}`);
  }
}

// Fetch questions for a specific race, optionally filtered by topic
export async function fetchQuestionsByRace(
  raceName: string,
  topic?: string
): Promise<Question[]> {
  try {
    let filterFormula = `{Race} = '${raceName}'`;
    if (topic && topic !== 'All') {
      filterFormula = `AND({Race} = '${raceName}', {Topic} = '${topic}')`;
    }

    const records = await base('Questions')
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: 'Question Key', direction: 'asc' }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      key: record.fields['Question Key'] as string,
      question: record.fields.Question as string,
      topic: record.fields.Topic as string,
      organization: record.fields.Organization as string,
      race: raceName,
    }));
  } catch (error) {
    console.error(`Error fetching questions for race "${raceName}":`, error);
    throw new Error(`Failed to fetch questions for race: ${raceName}`);
  }
}

// Fetch answers for a specific question
export async function fetchAnswersForQuestion(questionId: string): Promise<Answer[]> {
  try {
    const records = await base('Candidate Answers')
      .select({
        filterByFormula: `RECORD_ID() = RECORD_ID()`, // Get all records first
      })
      .all();

    const answers: Answer[] = [];

    for (const record of records) {
      const questionLinks = record.fields.Question as string[];
      if (questionLinks && questionLinks.includes(questionId)) {
        const candidateLinks = record.fields.Candidate as string[];
        if (candidateLinks && candidateLinks.length > 0) {
          try {
            // Fetch candidate name
            const candidateRecord = await base('Candidates').find(candidateLinks[0]);

            answers.push({
              candidate: {
                id: candidateLinks[0],
                name: candidateRecord.fields.Name as string,
              },
              answer: record.fields.Answer as string,
              source: record.fields.Source as string,
            });
          } catch (candidateError) {
            console.warn(`Could not fetch candidate ${candidateLinks[0]}:`, candidateError);
            // Continue processing other answers even if one candidate fails
          }
        }
      }
    }

    return answers;
  } catch (error) {
    console.error(`Error fetching answers for question "${questionId}":`, error);
    throw new Error(`Failed to fetch answers for question: ${questionId}`);
  }
}

// Get all unique topics
export async function fetchTopics(): Promise<string[]> {
  try {
    const records = await base('Questions')
      .select({
        fields: ['Topic'],
      })
      .all();

    const topics = new Set<string>();
    records.forEach(record => {
      if (record.fields.Topic) {
        topics.add(record.fields.Topic as string);
      }
    });

    return Array.from(topics).sort();
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw new Error('Failed to fetch topics from Airtable');
  }
}
