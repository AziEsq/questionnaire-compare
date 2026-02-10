# Questionnaire Compare

A Next.js application that displays candidate questionnaire responses in a comparison format, making it easy to compare different candidates' positions side-by-side.

## Features

- **Race Selection**: Choose from different electoral races
- **Candidate Filtering**: Select which candidates to compare (with Select All/Clear All)
- **Topic Filtering**: Filter questions by topic categories
- **Question Navigation**: Browse through questions with prev/next controls or dropdown
- **Side-by-Side Comparison**: View candidate answers in a responsive grid layout
- **URL State Management**: All selections are saved in the URL for easy sharing
- **Source Links**: Click through to view original sources for each answer
- **Read More/Less**: Expandable answers for better readability

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data Source**: Airtable
- **Deployment**: Ready for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Airtable account with API access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AziEsq/questionnaire-compare.git
cd questionnaire-compare
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Project Structure

```
questionnaire-compare/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page with data fetching
├── components/
│   ├── AnswerGrid.tsx       # Display candidate answers
│   ├── CandidateFilter.tsx  # Candidate selection checkboxes
│   ├── QuestionNavigator.tsx # Question navigation
│   ├── RaceSelector.tsx     # Race dropdown selector
│   └── TopicFilter.tsx      # Topic filter buttons
├── lib/
│   ├── airtable.ts          # Airtable integration with error handling
│   └── useQueryState.ts     # URL state management hook
└── [config files]
```

## Airtable Schema

The application expects the following Airtable tables:

### Races
- `Name` (text): Name of the race

### Candidates
- `Name` (text): Candidate name
- `Race` (text): Associated race

### Questions
- `Question Key` (text): Unique identifier
- `Question` (text): Question text
- `Topic` (text): Question category
- `Organization` (text): Source organization
- `Race` (text): Associated race

### Candidate Answers
- `Question` (linked record): Link to Questions table
- `Candidate` (linked record): Link to Candidates table
- `Answer` (text): Candidate's response
- `Source` (URL): Link to original source

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
4. Deploy!

## Improvements Made

This implementation includes several improvements over the original specification:

- ✅ **Fixed bug**: Added missing `<a>` tag in AnswerCard component
- ✅ **Error handling**: All Airtable functions include try/catch blocks
- ✅ **Better UX**: Individual candidate error handling doesn't break entire answer fetch
- ✅ **Modern Next.js**: Uses latest Next.js 16 conventions (async searchParams)
- ✅ **Type safety**: Full TypeScript coverage

## License

ISC
