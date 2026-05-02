# Nyaya.ai - Legal AI Assistant

A comprehensive legal AI assistant platform specializing in Indian law, built with Next.js, Supabase, and Puter.js AI.

## Features

- 🤖 **AI Legal Assistant**: Powered by Puter.js AI for accurate legal information
- 📄 **Document Generation**: AI-powered legal document creation and enhancement
- 👨‍💼 **Lawyer Directory**: Connect with real lawyers for personalized advice
- 💬 **Real-time Chat**: Interactive chat interface with AI responses
- 🌐 **Multi-language Support**: Internationalization support
- 🔐 **Authentication**: Secure user authentication with Supabase

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Puter.js AI (Free alternative to OpenAI)
- **Authentication**: Supabase Auth

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nyaya-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up Supabase

1. Create a new project at [Supabase](https://supabase.com/)
2. Get your project URL and API keys
3. Add them to your `.env.local` file
4. Run the database migration scripts in the `scripts/` folder

### 5. Run Database Migrations

Execute the SQL scripts in the `scripts/` folder in order:

```bash
# Run these in your Supabase SQL editor
001_create_users_table.sql
002_create_legal_tables.sql
003_seed_data.sql
# ... and so on
```

### 6. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## API Endpoints

### Chat API
- `POST /api/chat` - Main chat endpoint with Puter.js AI integration
- `POST /api/chat/start` - Start a new chat session

### Document APIs
- `POST /api/enhance-document` - Enhance legal documents with AI
- `POST /api/documents/enhance` - Alternative document enhancement endpoint

## AI Integration

The application uses Puter.js AI for:

- **Legal Q&A**: Providing accurate information about Indian law
- **Document Enhancement**: Improving legal document quality
- **Legal Consultation**: Acting as an AI lawyer for basic queries

### System Prompts

The AI is configured with specialized prompts for Indian legal context:

- Focus on Indian legal system and constitution
- Provide practical, actionable advice
- Use simple language for non-lawyers
- Include relevant legal sections/acts
- Emphasize general information vs. personalized advice

### Puter.js Integration

Puter.js is automatically loaded via CDN in the layout file:
```html
<script src="https://js.puter.com/v2/"></script>
```

The AI functionality is accessed through:
```javascript
const puter = (window as any).puter
const reply = await puter.ai.chat(prompt)
```

## Security

- No API keys required (Puter.js is free)
- User authentication required for all AI interactions
- Rate limiting and error handling implemented
- Secure database connections with Supabase

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
