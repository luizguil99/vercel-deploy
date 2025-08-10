import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { match } from 'ts-pattern';

// Configurar CORS para Vercel
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Configurar CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, corsHeaders);
    res.json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Verificar chave OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      res.writeHead(400, corsHeaders);
      res.json({
        error: "Missing OPENAI_API_KEY - configure it in Vercel environment variables",
      });
      return;
    }

    const { prompt, option, command } = req.body;
    
    if (!prompt || !option) {
      res.writeHead(400, corsHeaders);
      res.json({
        error: "Missing required fields: prompt and option"
      });
      return;
    }

    // Configurar mensagens baseadas na opção
    const messages = match(option)
      .with("continue", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that continues existing text based on context from prior text. " +
            "Give more weight/priority to the later characters than the beginning ones. " +
            "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
            "Use Markdown formatting when appropriate.",
        },
        {
          role: "user",
          content: prompt,
        },
      ])
      .with("improve", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that improves existing text. " +
            "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
            "Use Markdown formatting when appropriate.",
        },
        {
          role: "user",
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with("shorter", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that shortens existing text. " + 
            "Use Markdown formatting when appropriate.",
        },
        {
          role: "user",
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with("longer", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that lengthens existing text. " +
            "Use Markdown formatting when appropriate.",
        },
        {
          role: "user",
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with("zap", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that follows user commands to edit or generate text. " +
            "Use Markdown formatting when appropriate.",
        },
        {
          role: "user",
          content: `Command: ${command || 'edit'}\nText: ${prompt}`,
        },
      ])
      .otherwise(() => [
        {
          role: "system",
          content:
            "You are an AI writing assistant. " +
            "Use Markdown formatting when appropriate.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

    // Configurar headers para streaming
    res.writeHead(200, {
      ...corsHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    });

    // Gerar resposta usando streaming
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
      maxTokens: 500,
      temperature: 0.7,
    });

    // Enviar resposta em chunks
    for await (const chunk of result.textStream) {
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    console.error('Erro na API:', error);
    res.writeHead(500, corsHeaders);
    res.json({
      error: "Internal server error",
      details: error.message
    });
  }
}
