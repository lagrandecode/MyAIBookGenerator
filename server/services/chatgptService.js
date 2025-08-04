const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatGPTService {
  async generateBookContent(bookData) {
    try {
      const {
        title,
        author,
        language,
        level,
        style,
        goals,
        topics,
        examplesPerTopic,
        numberOfPages,
        includeTableOfContents,
        includeExercises,
        codeExplanation,
        tone,
        format
      } = bookData;

      // Create a comprehensive prompt for book generation
      const prompt = this.createBookPrompt({
        title,
        author,
        language,
        level,
        style,
        goals,
        topics,
        examplesPerTopic,
        numberOfPages,
        includeTableOfContents,
        includeExercises,
        codeExplanation,
        tone
      });

      console.log('Generating book content with ChatGPT...');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert technical book writer and programming instructor. Create comprehensive, well-structured educational content that is engaging and practical."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      const generatedContent = completion.choices[0].message.content;
      
      console.log('Book content generated successfully');
      
      return {
        success: true,
        content: generatedContent,
        metadata: {
          title,
          author,
          language,
          level,
          topics,
          format
        }
      };

    } catch (error) {
      console.error('Error generating book content:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate book content'
      };
    }
  }

  createBookPrompt(bookData) {
    const {
      title,
      author,
      language,
      level,
      style,
      goals,
      topics,
      examplesPerTopic,
      numberOfPages,
      includeTableOfContents,
      includeExercises,
      codeExplanation,
      tone
    } = bookData;

    return `
Create a comprehensive programming book titled "${title}" by ${author}.

BOOK SPECIFICATIONS:
- Programming Language: ${language}
- Difficulty Level: ${level}
- Writing Style: ${style}
- Tone: ${tone}
- Learning Goals: ${goals}
- Target Length: Approximately ${numberOfPages} pages

TOPICS TO COVER:
${topics.map((topic, index) => `${index + 1}. ${topic}`).join('\n')}

REQUIREMENTS:
- Include ${examplesPerTopic} practical examples per topic
- Target approximately ${numberOfPages} pages total
- ${includeTableOfContents ? 'Include a detailed table of contents' : 'No table of contents needed'}
- ${includeExercises ? 'Include practice exercises and challenges' : 'No exercises needed'}
- ${codeExplanation ? 'Provide detailed explanations for all code examples' : 'Minimal code explanations'}
- Use a ${tone.toLowerCase()} tone throughout
- Make content engaging and practical for ${level.toLowerCase()} level learners

STRUCTURE:
1. Introduction and setup
2. Each topic with examples and explanations
3. ${includeExercises ? 'Practice exercises for each topic' : ''}
4. Summary and next steps

Please generate the complete book content following these specifications. Make it comprehensive, well-structured, and ready for publication. The content should be approximately ${numberOfPages} pages long.
    `;
  }

  async generateChapterContent(topic, language, level, examplesCount, tone) {
    try {
      const prompt = `
Write a comprehensive chapter about "${topic}" for a ${level} level ${language} programming book.

Requirements:
- Explain the concept clearly for ${level} learners
- Include ${examplesCount} practical code examples
- Use a ${tone.toLowerCase()} tone
- Make it engaging and educational
- Include real-world applications where possible

Please provide the complete chapter content with proper formatting.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert programming instructor. Create clear, engaging, and practical educational content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;

    } catch (error) {
      console.error('Error generating chapter content:', error);
      throw new Error('Failed to generate chapter content');
    }
  }
}

module.exports = new ChatGPTService(); 