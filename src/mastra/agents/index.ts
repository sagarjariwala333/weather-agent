import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { weatherTool, searchTool } from '../tools';
import {
  WEATHER_AGENT_INSTRUCTIONS,
  GENERAL_AGENT_INSTRUCTIONS,
  IDEA_AGENT_INSTRUCTIONS,
  POST_AGENT_INSTRUCTIONS,
  SUPERVISOR_AGENT_INSTRUCTIONS
} from './prompts';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: WEATHER_AGENT_INSTRUCTIONS,
  model: process.env.OPENROUTER_MODEL || 'openrouter/google/gemini-2.0-flash-001',
  tools: { weatherTool, searchTool },
});

export const generalAgent = new Agent({
  name: 'General Agent',
  instructions: GENERAL_AGENT_INSTRUCTIONS,
  model: process.env.OPENROUTER_MODEL || 'openrouter/google/gemini-2.0-flash-001',
  tools: { searchTool },
});

export const ideaAgent = new Agent({
  name: 'Idea Generator Agent',
  instructions: IDEA_AGENT_INSTRUCTIONS,
  model: process.env.OPENROUTER_MODEL || 'openrouter/google/gemini-2.0-flash-001',
  tools: { searchTool },
});

export const postAgent = new Agent({
  name: 'Post Generator Agent',
  instructions: POST_AGENT_INSTRUCTIONS,
  model: process.env.OPENROUTER_MODEL || 'openrouter/google/gemini-2.0-flash-001',
  tools: { searchTool },
});

const generalAgentTool = createTool({
  id: 'general-agent',
  description: 'Call the General Agent for general purpose queries and discussions.',
  inputSchema: z.object({
    message: z.string().describe('The user message or query to pass to the agent.'),
  }),
  outputSchema: z.object({
    response: z.string().describe('The response from the agent.'),
  }),
  execute: async ({ context }) => {
    const result = await generalAgent.generate(context.message);
    return { response: result.text };
  },
});

const ideaAgentTool = createTool({
  id: 'idea-agent',
  description: 'Call the Idea Generator Agent to brainstorm content ideas.',
  inputSchema: z.object({
    message: z.string().describe('The request for content ideas.'),
  }),
  outputSchema: z.object({
    response: z.string().describe('The response from the agent.'),
  }),
  execute: async ({ context }) => {
    const result = await ideaAgent.generate(context.message);
    return { response: result.text };
  },
});

const postAgentTool = createTool({
  id: 'post-agent',
  description: 'Call the Post Generator Agent to write social media posts.',
  inputSchema: z.object({
    message: z.string().describe('The request for writing a post.'),
  }),
  outputSchema: z.object({
    response: z.string().describe('The response from the agent.'),
  }),
  execute: async ({ context }) => {
    const result = await postAgent.generate(context.message);
    return { response: result.text };
  },
});

export const supervisorAgent = new Agent({
  name: 'Supervisor Agent',
  instructions: SUPERVISOR_AGENT_INSTRUCTIONS,
  model: process.env.OPENROUTER_MODEL || 'openrouter/google/gemini-2.0-flash-001',
  tools: {
    generalAgentTool,
    ideaAgentTool,
    postAgentTool
  },
});
