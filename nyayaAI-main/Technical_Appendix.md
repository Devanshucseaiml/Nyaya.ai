# Technical Appendix: Nyaya.AI System Architecture and Implementation

## A.1 System Architecture Overview

### A.1.1 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (Supabase)    │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User          │    │   Database      │    │   OpenAI        │
│   Interface     │    │   (PostgreSQL)  │    │   API           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### A.1.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Nyaya.AI Platform                        │
├─────────────────────────────────────────────────────────────────┤
│  Frontend Layer (Next.js 14 + TypeScript)                       │
│  ├── User Interface Components                                  │
│  ├── State Management (React Hooks)                            │
│  ├── Internationalization (i18n)                               │
│  └── Progressive Web App (PWA)                                 │
├─────────────────────────────────────────────────────────────────┤
│  Backend Layer (Supabase)                                       │
│  ├── Authentication & Authorization                            │
│  ├── Database Management (PostgreSQL)                          │
│  ├── Real-time Subscriptions                                   │
│  └── File Storage                                              │
├─────────────────────────────────────────────────────────────────┤
│  AI Integration Layer                                           │
│  ├── OpenAI GPT-4 Integration                                  │
│  ├── Natural Language Processing                               │
│  ├── Document Generation Engine                                │
│  └── Multi-language Translation                                │
├─────────────────────────────────────────────────────────────────┤
│  External Services                                              │
│  ├── Payment Gateway Integration                               │
│  ├── Email Service (SMTP)                                      │
│  ├── SMS Gateway                                               │
│  └── Analytics & Monitoring                                    │
└─────────────────────────────────────────────────────────────────┘
```

## A.2 Database Schema Design

### A.2.1 Core Tables

```sql
-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    location TEXT,
    profession TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Know Your Rights Articles
CREATE TABLE kyr_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    language TEXT NOT NULL,
    tags TEXT[],
    author TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Templates
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    template_content TEXT NOT NULL,
    variables JSONB,
    language TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES document_templates(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    variables JSONB,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lawyer Directory
CREATE TABLE lawyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    specialization TEXT[],
    experience_years INTEGER,
    location TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    bio TEXT,
    rating DECIMAL(3,2),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal Stories
CREATE TABLE legal_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    language TEXT NOT NULL,
    anonymous BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL,
    content_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### A.2.2 Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_kyr_articles_category ON kyr_articles(category);
CREATE INDEX idx_kyr_articles_language ON kyr_articles(language);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_lawyers_specialization ON lawyers USING GIN(specialization);
CREATE INDEX idx_lawyers_location ON lawyers(location);
CREATE INDEX idx_legal_stories_category ON legal_stories(category);
CREATE INDEX idx_bookmarks_user_content ON bookmarks(user_id, content_type, content_id);
```

## A.3 API Endpoints Design

### A.3.1 Authentication Endpoints

```typescript
// Authentication
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/user

// User Profile
GET /api/user/profile
PUT /api/user/profile
```

### A.3.2 Chat and AI Endpoints

```typescript
// Chat Management
GET /api/chat/conversations
POST /api/chat/conversations
GET /api/chat/conversations/[id]
POST /api/chat/conversations/[id]/messages
GET /api/chat/conversations/[id]/messages

// AI Assistant
POST /api/chat/start
POST /api/chat/stream
```

### A.3.3 KYR and Content Endpoints

```typescript
// Know Your Rights
GET /api/kyr/articles
GET /api/kyr/articles/[id]
GET /api/kyr/categories
GET /api/kyr/search

// Legal Stories
GET /api/stories
POST /api/stories
GET /api/stories/[id]
PUT /api/stories/[id]
DELETE /api/stories/[id]
```

### A.3.4 Document Management

```typescript
// Document Templates
GET /api/documents/templates
GET /api/documents/templates/[id]

// Document Generation
POST /api/documents/generate
GET /api/documents/user
GET /api/documents/[id]
PUT /api/documents/[id]
DELETE /api/documents/[id]
```

### A.3.5 Lawyer Directory

```typescript
// Lawyer Management
GET /api/lawyers
GET /api/lawyers/[id]
POST /api/lawyers
PUT /api/lawyers/[id]

// Consultations
POST /api/consultations
GET /api/consultations/user
PUT /api/consultations/[id]/cancel
```

## A.4 AI Integration Architecture

### A.4.1 OpenAI Integration

```typescript
// AI Service Configuration
interface AIConfig {
  model: 'gpt-4' | 'gpt-3.5-turbo';
  temperature: number;
  max_tokens: number;
  system_prompt: string;
}

// Legal Assistant Service
class LegalAssistantService {
  async processQuery(query: string, context: any): Promise<string> {
    const prompt = this.buildLegalPrompt(query, context);
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });
    return response.choices[0].message.content;
  }

  private buildLegalPrompt(query: string, context: any): string {
    return `
      Context: ${JSON.stringify(context)}
      User Query: ${query}
      
      Please provide accurate legal information based on Indian law.
      Focus on educational content and general guidance.
      Include relevant legal provisions and practical steps.
    `;
  }
}
```

### A.4.2 Document Generation Engine

```typescript
// Document Generation Service
class DocumentGenerationService {
  async generateDocument(templateId: string, variables: any): Promise<string> {
    const template = await this.getTemplate(templateId);
    const aiEnhancedContent = await this.enhanceWithAI(template.content, variables);
    return this.fillTemplate(aiEnhancedContent, variables);
  }

  private async enhanceWithAI(content: string, variables: any): Promise<string> {
    const prompt = `
      Template Content: ${content}
      Variables: ${JSON.stringify(variables)}
      
      Enhance this legal document template with appropriate legal language
      and ensure compliance with Indian law. Maintain professionalism and clarity.
    `;
    
    const response = await this.aiService.processQuery(prompt, {});
    return response;
  }
}
```

## A.5 Security Implementation

### A.5.1 Authentication and Authorization

```typescript
// Row Level Security (RLS) Policies
-- Users can only access their own data
CREATE POLICY "users_select_own" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users 
  FOR UPDATE USING (auth.uid() = id);

-- Public read access for KYR articles
CREATE POLICY "kyr_articles_public_read" ON kyr_articles 
  FOR SELECT USING (true);

-- Users can only access their own conversations
CREATE POLICY "conversations_user_access" ON conversations 
  FOR ALL USING (auth.uid() = user_id);
```

### A.5.2 Data Encryption

```typescript
// Sensitive Data Encryption
class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key = process.env.ENCRYPTION_KEY;

  encrypt(text: string): string {
    const cipher = crypto.createCipher(this.algorithm, this.key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
```

## A.6 Performance Optimization

### A.6.1 Database Optimization

```sql
-- Connection pooling configuration
-- max_connections = 100
-- shared_preload_libraries = 'pg_stat_statements'

-- Query optimization
EXPLAIN ANALYZE SELECT * FROM kyr_articles 
WHERE category = 'consumer_rights' 
AND language = 'en' 
ORDER BY published_at DESC 
LIMIT 10;

-- Caching strategy
CREATE MATERIALIZED VIEW kyr_articles_summary AS
SELECT 
  category,
  language,
  COUNT(*) as article_count,
  MAX(published_at) as latest_article
FROM kyr_articles 
GROUP BY category, language;

REFRESH MATERIALIZED VIEW kyr_articles_summary;
```

### A.6.2 Frontend Optimization

```typescript
// Code splitting and lazy loading
const ChatInterface = lazy(() => import('./components/chat-interface'));
const DocumentGenerator = lazy(() => import('./components/document-generator'));

// Image optimization
import Image from 'next/image';

// Caching strategy
const cacheConfig = {
  maxAge: 60 * 60 * 24, // 24 hours
  staleWhileRevalidate: 60 * 60 * 24 * 7, // 7 days
};

// Service Worker for offline functionality
const swConfig = {
  cacheName: 'nyaya-ai-v1',
  urlsToCache: [
    '/',
    '/kyr',
    '/chat',
    '/documents',
    '/static/js/main.js',
    '/static/css/main.css'
  ]
};
```

## A.7 Monitoring and Analytics

### A.7.1 Performance Monitoring

```typescript
// Performance metrics collection
class PerformanceMonitor {
  trackPageLoad(url: string, loadTime: number) {
    analytics.track('page_load', {
      url,
      load_time: loadTime,
      timestamp: new Date().toISOString()
    });
  }

  trackAPIResponse(endpoint: string, responseTime: number, status: number) {
    analytics.track('api_response', {
      endpoint,
      response_time: responseTime,
      status,
      timestamp: new Date().toISOString()
    });
  }

  trackAIUsage(queryType: string, responseTime: number, accuracy: number) {
    analytics.track('ai_usage', {
      query_type: queryType,
      response_time: responseTime,
      accuracy,
      timestamp: new Date().toISOString()
    });
  }
}
```

### A.7.2 Error Tracking

```typescript
// Error monitoring and reporting
class ErrorTracker {
  captureError(error: Error, context: any) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.href
    };

    // Send to error tracking service
    errorTrackingService.capture(errorData);
  }
}
```

## A.8 Deployment Architecture

### A.8.1 Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                        Production Environment                    │
├─────────────────────────────────────────────────────────────────┤
│  Load Balancer (Cloudflare)                                     │
│  ├── SSL Termination                                            │
│  ├── DDoS Protection                                            │
│  └── CDN Distribution                                           │
├─────────────────────────────────────────────────────────────────┤
│  Application Servers (Vercel)                                   │
│  ├── Next.js Application                                        │
│  ├── API Routes                                                 │
│  └── Static Asset Serving                                       │
├─────────────────────────────────────────────────────────────────┤
│  Database Layer (Supabase)                                      │
│  ├── PostgreSQL Database                                        │
│  ├── Real-time Subscriptions                                   │
│  ├── Authentication Service                                     │
│  └── File Storage                                               │
├─────────────────────────────────────────────────────────────────┤
│  External Services                                              │
│  ├── OpenAI API                                                 │
│  ├── Email Service (SendGrid)                                   │
│  ├── SMS Gateway (Twilio)                                       │
│  └── Analytics (Google Analytics)                               │
└─────────────────────────────────────────────────────────────────┘
```

### A.8.2 CI/CD Pipeline

```yaml
# GitHub Actions Workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## A.9 Testing Strategy

### A.9.1 Unit Testing

```typescript
// Example unit tests
describe('LegalAssistantService', () => {
  it('should process legal queries correctly', async () => {
    const service = new LegalAssistantService();
    const query = 'What are my consumer rights?';
    const response = await service.processQuery(query, {});
    
    expect(response).toContain('consumer rights');
    expect(response).toMatch(/Consumer Protection Act/i);
  });

  it('should handle multi-language queries', async () => {
    const service = new LegalAssistantService();
    const query = 'मेरे उपभोक्ता अधिकार क्या हैं?';
    const response = await service.processQuery(query, { language: 'hi' });
    
    expect(response).toContain('उपभोक्ता');
  });
});
```

### A.9.2 Integration Testing

```typescript
// API integration tests
describe('Chat API', () => {
  it('should create a new conversation', async () => {
    const response = await request(app)
      .post('/api/chat/conversations')
      .send({ title: 'Test Conversation' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Conversation');
  });

  it('should add messages to conversation', async () => {
    const conversation = await createTestConversation();
    
    const response = await request(app)
      .post(`/api/chat/conversations/${conversation.id}/messages`)
      .send({ content: 'Test message', role: 'user' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe('Test message');
  });
});
```

## A.10 Scalability Considerations

### A.10.1 Horizontal Scaling

```typescript
// Database connection pooling
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis caching for session management
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});
```

### A.10.2 Microservices Architecture (Future)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   User Service  │    │   Chat Service  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Document      │    │   Lawyer        │    │   Notification  │
│   Service       │    │   Service       │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

This technical appendix provides comprehensive documentation of the Nyaya.AI platform's architecture, implementation details, and technical considerations for publication and further development.

