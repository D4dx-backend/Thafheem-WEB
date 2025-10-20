# Thafheemul Quran App - Complete API Documentation

## Overview

The Thafheemul Quran app integrates with multiple external APIs to provide comprehensive Quranic content, translation, interpretation, and AI-powered Islamic Q&A capabilities. This document provides detailed documentation for all API services used in the application.

## Table of Contents

1. [Quran.com API](#qurancom-api)
2. [Thafheem.net API](#thafheemnet-api)
3. [Thafheem AI API](#thafheem-ai-api)
4. [Directus CMS API](#directus-cms-api)
5. [Error Handling](#error-handling)
6. [Rate Limits & Usage](#rate-limits--usage)

---

## Quran.com API

**Base URL:** `https://api.quran.com/api/v4`

The Quran.com API (v4) provides access to authentic Quranic text, translations, audio, and metadata. It serves as the primary source for Quranic content in the application.

### Authentication

- No authentication required
- Public API with standard rate limiting

### Endpoints

#### 1. Get Chapters List

**Endpoint:** `GET /chapters`

**Purpose:** Retrieves list of all Quran chapters (Surahs) with translations

**Parameters:**

- `language` (string, required) - Language code (en, ml, ur, ta)

**Example Request:**

```
GET https://api.quran.com/api/v4/chapters?language=en
```

**Response Format:**

```json
{
  "chapters": [
    {
      "id": 1,
      "name_arabic": "الفاتحة",
      "name_simple": "Al-Fatihah",
      "revelation_place": "makkah",
      "revelation_order": 5,
      "bismillah_pre": true,
      "verses_count": 7,
      "pages": [1, 1],
      "translated_name": {
        "name": "The Opener",
        "language_name": "english"
      }
    }
  ]
}
```

#### 2. Get Quran Verses (Uthmani Script)

**Endpoint:** `GET /quran/verses/uthmani`

**Purpose:** Retrieves Arabic verses in Uthmani script format

**Parameters:**

- `chapter_number` (int, required) - Surah number (1-114)
- `page` (int, optional) - Page number for pagination

**Example Request:**

```
GET https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=1&page=1
```

#### 3. Get Translations

**Endpoint:** `GET /quran/translations/{translation_id}`

**Purpose:** Retrieves translated verses for specific translation resource

**Parameters:**

- `translation_id` (int, required) - Translation resource ID
- `chapter_number` (int, required) - Surah number
- `page` (int, optional) - Page number

**Common Translation IDs:**

- `131` - Dr. Mustafa Khattab, the Clear Quran (English)
- `158` - The Monotheist Group (English)

#### 4. Verse Search

**Endpoint:** `GET /search`

**Purpose:** Search for verses containing specific text

**Parameters:**

- `q` (string, required) - Search query
- `language` (string, required) - Language for search results

**Example Request:**

```
GET https://api.quran.com/api/v4/search?q=guidance&language=en
```

#### 5. Verse by Key

**Endpoint:** `GET /verses/by_key/{verse_key}`

**Purpose:** Get specific verse by its key (surah:verse format)

**Parameters:**

- `verse_key` (string, required) - Format: "surah_number:verse_number"

**Example Request:**

```
GET https://api.quran.com/api/v4/verses/by_key/1:1
```

#### 6. Audio Recitations

**Endpoint:** `GET /verses/by_key/{ayah_id}/recitations/{reciter_id}`

**Purpose:** Get audio URL for specific verse and reciter

**Parameters:**

- `ayah_id` (string, required) - Verse identifier
- `reciter_id` (int, required) - Reciter ID (default: 1 for Mishary Alafasy)

#### 7. Chapter Recitations

**Endpoint:** `GET /chapter_recitations/{reciter_id}/{chapter_id}`

**Purpose:** Get complete Surah audio URL

#### 8. Tafsir (Commentary)

**Endpoint:** `GET /tafsirs/{tafsir_id}/by_ayah/{verse_key}`

**Purpose:** Get commentary/interpretation for specific verse

**Parameters:**

- `tafsir_id` (int, required) - Commentary resource ID
- `verse_key` (string, required) - Verse identifier

#### 9. Footnotes

**Endpoint:** `GET /foot_notes/{footnote_id}`

**Purpose:** Get detailed footnote content

#### 10. Word by Word Meaning

**Endpoint:** `GET /verses/by_key/{verse_key}`

**Purpose:** Get word-by-word translation and meaning

**Parameters:**

- `words` (string, required) - Same as verse_key
- `word_fields` (string, required) - Fields to include (text_uthmani)
- `language` (string, required) - Language code

#### 11. Juz (Para) Information

**Endpoint:** `GET /Juzs`

**Purpose:** Get all Juz information with verse mappings

#### 12. Chapter Information

**Endpoint:** `GET /chapters/{chapter_number}/info`

**Purpose:** Get detailed information about specific chapter

**Parameters:**

- `language` (string, required) - Language for translated content

---

## Thafheem.net API

**Base URL:** `https://thafheem.net/thafheem-api`

The Thafheem API provides access to Maulana Abul A'la Maududi's Tafheem-ul-Quran commentary, translations, and audio content in multiple languages.

### Authentication

- No authentication required for most endpoints
- Some endpoints may require user authentication

### Endpoints

#### 1. Audio Translations

**Endpoint:** `GET /ayaaudiotransl/{surah_id}`

**Purpose:** Get audio translation text for entire Surah

**Parameters:**

- `surah_id` (int, required) - Surah number (1-114)

**Response Format:**

```json
[
  {
    "AudioText": "Translation text for verse"
  }
]
```

#### 2. Audio Interpretations

**Endpoint:** `GET /audiointerpret/{sura_id}/{aya_id}`

**Purpose:** Get audio interpretation content for specific verse

**Parameters:**

- `sura_id` (int, required) - Surah number
- `aya_id` (int, required) - Verse number

**Response Format:**

```json
[
  {
    "interptn_id": 1,
    "suraid": 1,
    "aya_no": 1,
    "interptn_no": 1,
    "AudioIntrerptn": "Interpretation content"
  }
]
```

#### 3. Word Meanings

**Endpoint:** `GET /wordmeanings/{sura_id}/{aya_id}`

**Purpose:** Get word-by-word meanings in Thafheem context

**Parameters:**

- `sura_id` (int, required) - Surah number
- `aya_id` (int, required) - Verse number

**Response Format:**

```json
[
  {
    "WordId": 1,
    "SuraId": 1,
    "AyaId": 1,
    "WordPhrase": "Arabic word",
    "Meaning": "Word meaning"
  }
]
```

#### 4. Surah Information

**Endpoint:** `GET /preface/{sura_id}`

**Purpose:** Get Thafheem preface/introduction for Surah

**Response Format:**

```json
[
  {
    "SuraId": 1,
    "RevOrder": 5,
    "TotalAyas": 7,
    "SuraType": "Makki",
    "ThafVolume": 1,
    "PrefaceSubTitle": "Introduction subtitle",
    "PrefaceText": "Detailed preface text"
  }
]
```

#### 5. Search in Thafheem

**Endpoint:** `GET /malengsearch/{search_type}/{query}`

**Purpose:** Search within Thafheem commentary and translations

**Parameters:**

- `search_type` (int, required) - Search type identifier
- `query` (string, required) - Search term

**Search Types:**

- `1` - Translation search
- `2` - Interpretation search
- `3` - Combined search

#### 6. Bookmarks Management

**Endpoint:** `GET /bookmarks`
**Endpoint:** `POST /bookmarks`
**Endpoint:** `DELETE /bookmarks/delete/{bookmark_id}`

**Purpose:** Manage user bookmarks

**Parameters for GET:**

- `bkType` (string, required) - Bookmark type (reading, translation, interpretation)

#### 7. Last Read Position

**Endpoint:** `GET /lastread`
**Endpoint:** `POST /lastread`

**Purpose:** Track and retrieve user's last reading position

#### 8. User Authentication

**Endpoint:** `POST /login`

**Purpose:** User login for personalized features

### Block Structure Endpoints

#### 9. Aya Ranges

**Endpoint:** `GET /ayaranges/{surah_id}`

**Purpose:** Get verse ranges for block-based reading structure

#### 10. Quran Text with Structure

**Endpoint:** `GET /qurantext/{surah_id}`
**Endpoint:** `GET /qurantext/{surah_id}/{range}`

**Purpose:** Get structured Quranic text with audio URLs

**Response includes:**

- Arabic text (cleaned)
- Translation
- Interpretation
- Audio URLs for different content types
- Page information

#### 11. Translation Ranges

**Endpoint:** `GET /ayatransl/{surah_id}/{range}`

**Purpose:** Get translations for specific verse ranges

#### 12. Interpretation Ranges

**Endpoint:** `GET /interpret/{surah_id}/{range}/{interpretation_no}`
**Endpoint:** `GET /interpret/{surah_id}/{range}/{interpretation_no}/{language}`

**Purpose:** Get interpretations for verse ranges with language support

---

## Thafheem AI API

**Base URL:** Dynamically fetched from Directus CMS (default: `http://162.55.246.209:8080`)

The Thafheem AI API provides intelligent Islamic Q&A capabilities with multilingual support, contextual search, and conversation management.

### Version

- **Current Version:** v2.5.0
- **Features:** Streaming responses, structured search, usage monitoring

### Authentication

- No authentication required
- Rate limited by IP address
- Daily usage limits apply

### Core Features

- **Multilingual Support:** English, Malayalam, Tamil, Bengali, Hindi, Urdu
- **Contextual Understanding:** AI-powered responses with Quranic context
- **Session Management:** Persistent conversation history
- **Streaming Responses:** Real-time response generation
- **Structured Search:** Advanced content analysis and frequency studies

### Endpoints

#### 1. Start Chat Session

**Endpoint:** `POST /chat/start`

**Purpose:** Initialize new conversation session

**Request Body:**

```json
{
  "initial_question": "What is the meaning of life in Islam?",
  "similarity_threshold": 70.0
}
```

**Response Format:**

```json
{
  "session_id": "uuid-string",
  "response": "AI response text",
  "detected_language": "en",
  "results_count": 5,
  "similarity_threshold": 70.0,
  "conversation_length": 1,
  "message": "Session started successfully",
  "context_optimization": {
    "matched_verses": 5,
    "context_tokens": 150
  },
  "performance_tracking": {
    "response_time": 2.34,
    "token_count": 120
  }
}
```

#### 2. Continue Chat Session

**Endpoint:** `POST /chat/continue`

**Purpose:** Continue existing conversation

**Request Body:**

```json
{
  "session_id": "uuid-string",
  "question": "Can you explain more about this topic?",
  "similarity_threshold": 70.0
}
```

#### 3. Streaming Chat (v2.5.0)

**Endpoint:** `POST /chat/stream-start`
**Endpoint:** `POST /chat/stream-continue`

**Purpose:** Real-time streaming responses

**Headers:**

- `Accept: text/event-stream`
- `Cache-Control: no-cache`
- `Connection: keep-alive`

**Stream Events:**

- `session_info` - Session metadata
- `status` - Processing status updates
- `content` - Response content chunks
- `preference_request` - User preference queries
- `done` - Completion signal

#### 4. Stop Streaming

**Endpoint:** `POST /chat/stream-stop`

**Purpose:** Terminate active streaming session

#### 5. Chat History

**Endpoint:** `GET /chat/history/{session_id}`

**Purpose:** Retrieve complete conversation history

#### 6. List Sessions

**Endpoint:** `GET /chat/sessions`

**Purpose:** Get all chat sessions for current user

#### 7. Delete Session

**Endpoint:** `DELETE /chat/session/{session_id}`

**Purpose:** Remove chat session and history

#### 8. Single Question

**Endpoint:** `POST /ask`

**Purpose:** Ask question without session state

**Request Body:**

```json
{
  "question": "What does the Quran say about patience?",
  "similarity_threshold": 70.0,
  "custom_context": "Optional context",
  "custom_prompt": "Optional prompt modification"
}
```

#### 9. Structured Search (v2.5.0)

**Endpoint:** `POST /structured-search`

**Purpose:** Advanced Islamic content search with analytics

**Request Body:**

```json
{
  "query": "patience",
  "mode": "frequency",
  "exact_match": false,
  "surah_id": 2,
  "language": "en",
  "limit": 50
}
```

**Search Modes:**

- `frequency` - Frequency analysis across Quran
- `location` - Location-based verse mapping
- `context` - Contextual relationship analysis

**Response Format:**

```json
{
  "response": "Analytical response about the search term",
  "statistics": {
    "total_occurrences": 15,
    "unique_surahs": 8,
    "most_mentioned_surah": "Al-Baqarah",
    "most_mentioned_surah_count": 5,
    "search_terms": ["patience", "sabr"],
    "term_frequency": {
      "patience": 10,
      "sabr": 5
    },
    "surah_distribution": {
      "1": 2,
      "2": 5,
      "3": 3
    },
    "average_relevance_score": 85.2,
    "search_duration": 1.23
  },
  "occurrences": [
    {
      "surah_id": 2,
      "verse_id": 155,
      "verse_key": "2:155",
      "arabic_text": "Arabic verse text",
      "translation": "English translation",
      "relevance_score": 95.5,
      "context": "Surrounding context",
      "highlight": "Highlighted matching text"
    }
  ],
  "original_query": {
    "query": "patience",
    "mode": "frequency",
    "exact_match": false
  }
}
```

#### 10. Health Check

**Endpoint:** `GET /health`

**Purpose:** Check API health and dependencies

#### 11. Performance Metrics

**Endpoint:** `GET /metrics`

**Purpose:** Get system performance statistics

#### 12. Usage Check

**Endpoint:** `GET /usage/check`

**Purpose:** Check current usage and limits

**Response Format:**

```json
{
  "status": "active",
  "daily_usage": {
    "used": 15,
    "limit": 50,
    "remaining": 35,
    "reset_time": "2024-01-01T00:00:00Z",
    "is_near_limit": false,
    "is_at_limit": false
  }
}
```

#### 13. Submit Feedback

**Endpoint:** `POST /feedback`

**Purpose:** Submit user feedback for AI responses

**Request Body:**

```json
{
  "session_id": "uuid",
  "message_index": 1,
  "feedback_type": "thumbs_up",
  "rating": 5,
  "feedback_text": "Very helpful response"
}
```

**Feedback Types:**

- `thumbs_up` - Positive feedback
- `thumbs_down` - Negative feedback
- `rating` - Numerical rating (1-5)
- `text_feedback` - Written feedback
- `report_issue` - Report problems

#### 14. Language Configurations

**Endpoint:** `GET /language-configs`

**Purpose:** Get language-specific settings and thresholds

#### 15. Custom Query

**Endpoint:** `POST /api/query`

**Purpose:** Execute custom database queries

**Request Body:**

```json
{
  "query": "SELECT * FROM verses WHERE content LIKE '%patience%'"
}
```

### Rate Limits (v2.5.0)

- **Daily Limit:** 50 requests per IP address
- **Session Timeout:** 1 hour Redis-based expiration
- **Streaming Timeout:** 30 minutes per session
- **Concurrent Streams:** 5 maximum per IP

### Language Support

- **English (en):** Similarity threshold 75.0
- **Malayalam (ml):** Similarity threshold 60.0
- **Tamil (ta):** Similarity threshold 65.0
- **Bengali (bn):** Similarity threshold 65.0
- **Hindi (hi):** Similarity threshold 65.0
- **Urdu (ur):** Similarity threshold 60.0

### Response Times (Expected)

- **Cached Responses:** < 100ms
- **New Queries:** 1-5 seconds
- **Complex Multilingual:** 2-8 seconds
- **Streaming First Token:** < 2 seconds
- **Streaming Subsequent:** < 500ms

---

## Directus CMS API

**Base URL:** `https://directus.d4dx.co/`

Directus serves as the headless CMS for managing app configuration, banners, and AI API settings.

### Endpoints

#### 1. App Settings

**Endpoint:** `GET /items/thafheem_app_settings`

**Purpose:** Get global application settings including Ramadan counters and feature flags

#### 2. Home Banner

**Endpoint:** `GET /items/thafheem_homebanner`

**Purpose:** Retrieve home screen banner content and promotional materials

#### 3. AI API Configuration

**Endpoint:** `GET /items/thafheem_ai_api`

**Purpose:** Get AI API configuration including base URL and feature enablement

**Response Format:**

```json
{
  "data": {
    "show_ai_": true,
    "thafheemai_api_base_url": "http://162.55.246.209:8080"
  }
}
```

---

## Error Handling

### Common HTTP Status Codes

#### Quran.com API

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Resource not found
- `429` - Rate limit exceeded
- `500` - Server error

#### Thafheem API

- `200` - Success
- `404` - Content not found
- `500` - Server error

#### AI API

- `200` - Success
- `400` - Bad Request (validation failed)
- `408` - Timeout
- `429` - Rate limit exceeded
- `500` - Server error

### Error Response Format

**Quran.com API:**

```json
{
  "error": "Error message",
  "status": 400
}
```

**Thafheem AI API:**

```json
{
  "error": "Detailed error message",
  "error_code": "VALIDATION_ERROR",
  "details": {
    "field": "description of issue"
  }
}
```

### Application Error Handling

The app implements comprehensive error handling:

1. **Network Timeouts:** 30-second default timeout
2. **Retry Logic:** Automatic retries for network failures
3. **Graceful Degradation:** Offline functionality when possible
4. **User Feedback:** Clear error messages in UI
5. **Logging:** Detailed error logging for debugging

---

## Rate Limits & Usage

### Quran.com API

- No explicit rate limits documented
- Reasonable usage expected
- Public API with fair use policy

### Thafheem API

- No explicit rate limits
- Server capacity dependent

### AI API (v2.5.0)

- **Daily Limit:** 50 requests per IP
- **Per Session:** No explicit limit
- **Streaming:** Max 5 concurrent sessions per IP
- **Timeout:** 1 hour session expiration

### Best Practices

1. **Caching:** Implement local caching for frequently accessed content
2. **Pagination:** Use pagination parameters when available
3. **Batch Requests:** Minimize API calls where possible
4. **Error Handling:** Implement proper retry mechanisms
5. **User Experience:** Show loading states and handle failures gracefully

---

## Integration Examples

### Basic Quran.com API Usage

```dart
// Get Surah list
final response = await QuranComApiService().fetchSurahs('en');

// Get specific verse
final verse = await QuranComApiService().fetchSingleVerse(1, 1, '1');

// Search verses
final results = await QuranComApiService().searchAyahs('guidance', 'en');
```

### Thafheem API Usage

```dart
// Get Thafheem commentary
final interpretation = await ThafheemApiService().fetchAudioInterpretation(1, 1);

// Search Thafheem content
final searchResults = await ThafheemApiService().searchThafheem('patience', 1);
```

### AI API Usage

```dart
// Start AI chat
final response = await AiApiClient.startChatSession(
  initialQuestion: 'What is Islamic perspective on patience?',
  similarityThreshold: 70.0,
);

// Continue conversation
final continueResponse = await AiApiClient.continueChatSession(
  sessionId: sessionId,
  question: 'Can you provide more examples?',
);

// Structured search
final searchResult = await AiApiClient.performStructuredSearch(
  query: 'patience',
  mode: 'frequency',
  exactMatch: false,
);
```

---

## Conclusion

This comprehensive API documentation covers all external services integrated into the Thafheemul Quran application. The app leverages these APIs to provide:

1. **Authentic Quranic Content** via Quran.com API
2. **Scholarly Commentary** via Thafheem.net API
3. **AI-Powered Q&A** via Thafheem AI API
4. **Dynamic Configuration** via Directus CMS

Each API serves a specific purpose in delivering a complete Islamic learning experience with multilingual support, audio features, and intelligent content discovery.

For implementation details and code examples, refer to the respective service files in the `lib/services/api/` directory of the project.

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**API Versions:** Quran.com v4, Thafheem AI v2.5.0
