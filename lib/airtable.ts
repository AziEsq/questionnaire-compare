import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

export interface Race {
  id: string;
  key: string;        // "2026-P-Federal-IL9"
  displayName: string; // "2026 Primary Congress IL 9"
}

export interface Candidate {
  id: string;
  name: string;
  lastName: string;
  race: string;
  photo?: string;
  overTenPercent?: boolean;
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
    lastName: string;
    photo?: string;
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
      key: record.fields.Name as string,
      displayName: record.fields.Race as string,
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

    // Log the first record to see what fields are available
    if (records.length > 0) {
      console.log('Sample candidate fields:', Object.keys(records[0].fields));
      console.log('Sample candidate data:', records[0].fields);
    }

    const candidates = records.map(record => {
      const photoField = record.fields.Photo as any;
      const photoUrl = photoField?.[0]?.thumbnails?.large?.url || photoField?.[0]?.url;
      const overTen = record.fields['Over 10pct in Polls?'] === 'Yes';

      return {
        id: record.id,
        name: record.fields['Full Name'] as string,
        lastName: record.fields.LastName as string,
        race: raceName,
        photo: photoUrl,
        overTenPercent: overTen,
      };
    });

    // Sort by last name alphabetically
    return candidates.sort((a, b) =>
      (a.lastName || '').localeCompare(b.lastName || '')
    );
  } catch (error) {
    console.error(`Error fetching candidates for race "${raceName}":`, error);
    throw new Error(`Failed to fetch candidates for race: ${raceName}`);
  }
}

// Fetch questions for a specific race, optionally filtered by topic and organization
export async function fetchQuestionsByRace(
  raceName: string,
  topic?: string,
  organization?: string
): Promise<Question[]> {
  try {
    let filterFormula = `{Race} = '${raceName}'`;

    const conditions = [`{Race} = '${raceName}'`];
    if (topic && topic !== 'All') {
      conditions.push(`{Topic} = '${topic}'`);
    }
    if (organization) {
      conditions.push(`{Organization} = '${organization}'`);
    }

    if (conditions.length > 1) {
      filterFormula = `AND(${conditions.join(', ')})`;
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
            // Fetch candidate data
            const candidateRecord = await base('Candidates').find(candidateLinks[0]);
            const photoField = candidateRecord.fields.Photo as any;
            const photoUrl = photoField?.[0]?.thumbnails?.large?.url || photoField?.[0]?.url;

            answers.push({
              candidate: {
                id: candidateLinks[0],
                name: candidateRecord.fields['Full Name'] as string,
                lastName: candidateRecord.fields.LastName as string,
                photo: photoUrl,
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

    // Sort answers by candidate last name alphabetically
    return answers.sort((a, b) =>
      (a.candidate.lastName || '').localeCompare(b.candidate.lastName || '')
    );
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

// Get all unique organizations
export async function fetchOrganizations(): Promise<string[]> {
  try {
    const records = await base('Questions')
      .select({
        fields: ['Organization'],
      })
      .all();

    const organizations = new Set<string>();
    records.forEach(record => {
      if (record.fields.Organization) {
        organizations.add(record.fields.Organization as string);
      }
    });

    return Array.from(organizations).sort();
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw new Error('Failed to fetch organizations from Airtable');
  }
}
