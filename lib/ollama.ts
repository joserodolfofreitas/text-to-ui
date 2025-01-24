import axios from 'axios';

export const DEFAULT_MODEL = 'llama3.2';
export const DEEPTHINK_MODEL = 'deepseek-r1';

export function getModelForPrompt(prompt: string) {
    return prompt.toLowerCase().includes('use deepthink') ? DEEPTHINK_MODEL : DEFAULT_MODEL;
}

const SYSTEM_PROMPT = `You are a UI component generator. You generate JSX code using Material-UI (MUI) components.

Available components:
Layout Components:
- Box: For basic layout container
- Container: For page-level containers
- Stack: For one-dimensional layouts
- Grid: For grid layouts (use Grid container and Grid item)
- Paper: For surface elements

Content Components:
- Typography: For text content (use variant and color props)
- Button: For actions (use variant and color props)
- TextField: For input fields
- IconButton: For icon buttons

Card Components:
- Card: Container component
- CardContent: For card content
- CardHeader: For card headers
- CardActions: For card action buttons

Rules:
1. Use ONLY the components listed above
2. Use proper MUI styling with the 'sx' prop
3. Follow MUI best practices and patterns
4. Keep the code clean and readable
5. Add meaningful Typography variants and colors
6. Use proper spacing with MUI's spacing system (e.g., mt: 2, p: 3)
7. Make components responsive using MUI's responsive values
8. Return ONLY valid JSX code without any explanation or markdown

Example:
<Box sx={{ p: 2 }}>
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Typography variant="h4" gutterBottom>
        Welcome
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        This is a sample using MUI components.
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Grid>
  </Grid>
</Box>`

function cleanGeneratedCode(code: string): string {
  // Remove markdown code blocks if present
  code = code.replace(/\`\`\`jsx?/g, '').replace(/\`\`\`/g, '')
  
  // Remove any text before the first < and after the last >
  code = code.substring(code.indexOf('<'), code.lastIndexOf('>') + 1)
  
  // Trim whitespace
  code = code.trim()
  
  console.log('Cleaned code:', code)
  return code
}

export async function getLlamaResponse(prompt: string) {
  try {
    const selectedModel = getModelForPrompt(prompt);
    console.log(' Using model:', selectedModel);
    console.log(' Sending prompt:', prompt);
    
    const response = await axios.post('/api/ollama', {
      model: selectedModel,
      prompt: `${SYSTEM_PROMPT}\n\nUser: ${prompt}\n\nAssistant: Here's the JSX code using MUI components:`,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log(' Received response status:', response.status);
    console.log(' Raw response data:', response.data);
    
    if (!response.data || !response.data.response) {
      console.error(' Invalid response format:', response.data);
      throw new Error('Invalid response format from Ollama');
    }

    const generatedCode = cleanGeneratedCode(response.data.response);
    return generatedCode;
  } catch (error: any) {
    console.error(' Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    
    if (error.response) {
      console.error(' Server responded with:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error(' No response received. Request details:', {
        url: error.request.url,
        method: error.request.method
      });
    }
    
    throw error;
  }
}
