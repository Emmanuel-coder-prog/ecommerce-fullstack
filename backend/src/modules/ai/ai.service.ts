import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

/**
 * Interface for AI-generated content
 */
export interface GeneratedContent {
  title: string;
  description: string;
}

/**
 * AI Service
 * Handles all interactions with OpenRouter API for content generation
 * OpenRouter provides access to multiple LLM models through a unified API
 * Uses various models for generating product titles and descriptions
 */
@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    // Initialize OpenAI SDK client configured for OpenRouter
    // OpenRouter is compatible with OpenAI's API and has better model availability
    this.openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3001', // Optional: your app URL
      },
    });
  }

  /**
   * Generate product title and description using OpenRouter API
   * @param keywords - Keywords provided by user to base generation on
   * @returns Generated title and description
   */
  async generateProductContent(keywords: string): Promise<GeneratedContent> {
    if (!keywords || keywords.trim().length === 0) {
      throw new Error('Keywords cannot be empty');
    }

    try {
      // Make API call to OpenRouter to generate content
      // OpenRouter provides access to many models with a single API
      const response = await this.openai.chat.completions.create({
        model: 'openai/gpt-3.5-turbo', // Working OpenRouter model
        messages: [
          {
            role: 'system',
            content: `You are an expert e-commerce product writer. Generate compelling product titles and descriptions based on keywords. 
            Return response as JSON with "title" and "description" fields.
            Title should be 50-100 characters.
            Description should be 2-3 sentences, highlight key features and benefits.`,
          },
          {
            role: 'user',
            content: `Generate a product title and description for: ${keywords}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      });

      // Extract the generated content from the response
      const content = response.choices[0]?.message?.content;

      // Debug logging
      if (!response.choices[0]) {
        console.warn('No choices in OpenRouter response:', JSON.stringify(response));
      }

      if (!content) {
        console.warn('No content in OpenRouter response. Response:', JSON.stringify(response));
        throw new Error('No content received from OpenRouter');
      }

      // Parse the JSON response
      const generatedData = JSON.parse(content);

      return {
        title: generatedData.title || 'Product',
        description:
          generatedData.description || 'High-quality product available now.',
      };
    } catch (error: any) {
      // Log the error for debugging
      console.error('OpenRouter API Error:', error.message);

      // If API fails, generate fallback content using keywords instead of throwing error
      // This ensures the app keeps working even if the AI API is down
      if (keywords && keywords.trim().length > 0) {
        const words = keywords.split(/\s+/);
        const capitalizedWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        return {
          title: `Premium ${capitalizedWords}`,
          description: `High-quality ${keywords}. Carefully selected for best value and performance.`,
        };
      }

      // If no keywords and API failed, throw error
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
}
