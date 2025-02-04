import axios from 'axios';

const DEFAULT_MODEL = 'llama3.2';
const DEEPTHINK_MODEL = 'deepseek-r1';

export function getModelForPrompt(prompt: string): string {
  return prompt.toLowerCase().includes('use deepthink') ? DEEPTHINK_MODEL : DEFAULT_MODEL;
}

const SYSTEM_PROMPT = `You are an expert UI component generator specializing in Material-UI (MUI). Your task is to create sophisticated, well-structured, and visually appealing user interfaces.

Available MUI Components:

Layout Components:
- Box: Wrapper component for layouts with sx prop support
- Container: Centered content container with maxWidth
- Stack: Flexible one-dimensional layouts (vertical/horizontal)
- Grid: Powerful 12-column grid system
  - Use Grid container with spacing
  - Use Grid item with xs/sm/md/lg breakpoints
- Paper: Surface elements with elevation

Content Components:
- Typography: Rich text styling
  - variants: h1-h6, subtitle1, subtitle2, body1, body2
  - colors: primary, secondary, text.primary, text.secondary
  - props: gutterBottom, align, noWrap
- Button: Interactive elements
  - variants: text, contained, outlined
  - colors: primary, secondary, error, info, success
  - size: small, medium, large
- TextField: Input fields
  - variants: outlined, filled, standard
  - types: text, number, password
  - props: label, placeholder, helperText
- IconButton: Circular buttons for icons

Card Components:
- Card: Container with optional elevation
- CardHeader: Title, subheader, and avatar area
- CardContent: Main content area with padding
- CardActions: Action buttons container

Best Practices:
1. Create responsive layouts using Grid breakpoints
2. Implement proper spacing and hierarchy
3. Use Typography variants for clear text hierarchy
4. Include interactive elements (buttons, fields)
5. Apply consistent spacing with MUI's system
6. Make interfaces accessible with proper ARIA labels
7. Use color effectively for visual hierarchy
8. Include hover and focus states

Example of a Comprehensive UI:

<Box sx={{ p: 3 }}>
  <Container maxWidth="lg">
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Typography variant="h4" color="primary" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back! Here's your latest activity summary.
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Stack spacing={2}>
                <Typography variant="h6">Recent Activity</Typography>
                <TextField
                  fullWidth
                  label="Search activities"
                  variant="outlined"
                  size="small"
                />
                <Button variant="contained" color="primary">
                  View All Activities
                </Button>
              </Stack>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: "100%" }}>
              <CardHeader
                title="Statistics"
                subheader="Last 30 days"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Your performance has increased by 25%
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Stack spacing={2}>
            <Button variant="outlined" color="primary" fullWidth>
              Create New Report
            </Button>
            <Button variant="outlined" color="secondary" fullWidth>
              View Analytics
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  </Container>
</Box>`

function cleanGeneratedCode(code: string, model: string): string {
  // Remove markdown code blocks if present
  code = code.replace(/\`\`\`jsx?/g, '').replace(/\`\`\`/g, '')
  
  if (model === DEEPTHINK_MODEL) {
    // Remove content between <think> tags for DeepThink model
    code = code.replace(/<think>[\s\S]*?<\/think>/g, '')
  }
  
  // Remove any text before the first < and after the last >
  code = code.substring(code.indexOf('<'), code.lastIndexOf('>') + 1)
  
  // Trim whitespace
  code = code.trim()
  
  console.log('Cleaned code:', code)
  return code
}

export async function getLlamaResponse(prompt: string, useDeepThink: boolean = false) {
  try {
    const model = useDeepThink ? DEEPTHINK_MODEL : DEFAULT_MODEL
    console.log('Using model:', model)

    const response = await axios.post('/api/ollama', {
      model,
      prompt: `${SYSTEM_PROMPT}\n\nUser: Create a comprehensive UI for the following: ${prompt}\n\nAssistant: Here's a sophisticated MUI implementation:`,
      stream: true
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const generatedCode = cleanGeneratedCode(response.data.response, model)
    return generatedCode
  } catch (error) {
    console.error('Error calling Ollama:', error)
    throw new Error('Failed to generate UI component')
  }
}
