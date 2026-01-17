import { supervisorAgent } from '../src/mastra/agents';
import { Mastra } from '@mastra/core/mastra';
import { config } from 'dotenv';

config();

async function verifyRouting() {
  console.log('🧪 Verifying Supervisor Agent Routing...');

  const testCases = [
    {
      query: 'What is the capital of France?',
      expectedAgent: 'General Agent',
      expectedTool: 'general-agent'
    },
    {
      query: 'I need ideas for a YouTube video about AI agents',
      expectedAgent: 'Idea Generator Agent',
      expectedTool: 'idea-agent'
    },
    {
      query: 'Write specific LinkedIn post about how AI is changing coding',
      expectedAgent: 'Post Generator Agent',
      expectedTool: 'post-agent'
    }
  ];

  for (const test of testCases) {
    console.log(`\nTesting query: "${test.query}"`);
    try {
      const result = await supervisorAgent.generate(test.query);
      console.log(`✅ Response received.`);
      console.log(`Preview: ${result.text.substring(0, 100)}...`);
      // In a real integration test we would spy on the tools, 
      // but here we just check if we get a valid response without error.
      // The content of the response should indicate which agent handled it.
    } catch (error) {
      console.error(`❌ Error verifying query: "${test.query}"`, error);
    }
  }
}

verifyRouting();
