import analyzeExcel from '../utils/analyzeExcel.js';
import OpenAI from 'openai';
import Upload from '../models/Upload.js';

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key is not configured');
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
  maxRetries: 2
});

export const generateInsight = async (req, res) => {
  try {
    const fileId = req.params.id;

    // Validate fileId
    if (!fileId || !fileId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }

    const file = await Upload.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Validate file buffer exists
    if (!file.buffer) {
      return res.status(400).json({ error: 'File content is missing' });
    }

    // Safe buffer handling
    let buffer;
    if (file.buffer instanceof Buffer) {
      buffer = file.buffer;
    } else if (typeof file.buffer === 'string') {
      buffer = Buffer.from(file.buffer, 'base64');
    } else if (file.buffer && file.buffer.data) {
      // Handle MongoDB Binary type
      buffer = Buffer.from(file.buffer.data);
    } else {
      return res.status(400).json({ error: 'Invalid file buffer format' });
    }

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'File content is empty' });
    }

    const analysis = analyzeExcel(buffer);

    if (!analysis) {
      return res.status(400).json({ error: 'Empty or invalid Excel file' });
    }

    // Validate analysis structure
    if (!analysis.metrics || typeof analysis.metrics !== 'object') {
      return res.status(400).json({ error: 'Invalid analysis data format' });
    }

    let prompt = `The uploaded Excel data contains the following columns and summary statistics:\n\n`;
    
    // Safe property access with validation
    for (const [col, metric] of Object.entries(analysis.metrics)) {
      if (metric && typeof metric === 'object') {
        const sum = typeof metric.sum === 'number' ? metric.sum.toFixed(2) : 'N/A';
        const avg = typeof metric.avg === 'number' ? metric.avg.toFixed(2) : 'N/A';
        prompt += `- ${col}: total ${sum}, average ${avg}\n`;
      } else {
        prompt += `- ${col}: data available but metrics not calculated\n`;
      }
    }
    
    prompt += `\nPlease provide a brief, insightful summary based on these statistics.`;

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI service is not properly configured' });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      });

      const insight = completion.choices[0]?.message?.content?.trim() || 'No insight generated';
      
      res.json({ 
        insight, 
        columns: analysis.columns || [], 
        columnTypes: analysis.columnTypes || {} 
      });
    } catch (openaiError) {
      if (openaiError.status === 429) {
        // Rate limit error - provide fallback insight
        console.warn('OpenAI rate limit reached, providing fallback insight');
        
        // Generate basic insight without AI
        let fallbackInsight = 'Based on the uploaded data:\n\n';
        const metrics = analysis.metrics || {};
        
        for (const [col, metric] of Object.entries(metrics)) {
          if (metric && typeof metric === 'object') {
            const sum = typeof metric.sum === 'number' ? metric.sum.toFixed(2) : 'N/A';
            const avg = typeof metric.avg === 'number' ? metric.avg.toFixed(2) : 'N/A';
            fallbackInsight += `• ${col}: Total ${sum}, Average ${avg}\n`;
          }
        }
        
        fallbackInsight += '\nThe data appears to be well-structured. Consider visualizing trends or comparing values across different categories.';
        
        res.json({ 
          insight: fallbackInsight, 
          columns: analysis.columns || [], 
          columnTypes: analysis.columnTypes || {},
          warning: 'AI insights temporarily unavailable due to rate limits'
        });
      } else {
        throw openaiError;
      }
    }

    res.json({ 
      insight, 
      columns: analysis.columns || [], 
      columnTypes: analysis.columnTypes || {} 
    });
    
  } catch (error) {
    console.error('Error generating insight:', error);
    
    // More specific error handling
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'AI service is currently unavailable' });
    }
    
    if (error.status === 401) {
      return res.status(500).json({ error: 'AI service authentication failed' });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'AI service rate limit exceeded' });
    }
    
    res.status(500).json({ error: 'Failed to generate insight' });
  }
};
