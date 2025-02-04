import axios from 'axios';

//const DEFAULT_MODEL = 'llama3.2';
const DEFAULT_MODEL = 'deepseek-coder-v2';
const DEEPTHINK_MODEL = 'deepseek-r1';

export function getModelForPrompt(prompt: string): string {
  return prompt.toLowerCase().includes('use deepthink') ? DEEPTHINK_MODEL : DEFAULT_MODEL;
}

const SYSTEM_PROMPT = `You are an expert UI component generator specializing in Material-UI (MUI). Your task is to create sophisticated, well-structured, and visually appealing user interfaces.

IMPORTANT: Your response MUST be valid TypeScript/TSX code that follows these rules:
1. Include ALL necessary imports at the top
2. Export the component as default
3. Use proper TypeScript types for props and state
4. Ensure all JSX elements are properly closed
5. Use proper comma separation in object literals and arrays
6. Follow proper TSX syntax for component props
7. Avoid any syntax errors or undefined references

Available MUI Components:

Layout Components:
- Box: Wrapper component for layouts with sx prop support
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

Icons:
For icons, ONLY use the following from @mui/icons-material:
- ArrowUpward as UpIcon
- ArrowDownward as DownIcon
- Menu as MenuIcon
- Close as CloseIcon
- Add as AddIcon
- Delete as DeleteIcon
- Edit as EditIcon
- Settings as SettingsIcon
- Search as SearchIcon

Best Practices:
1. Create responsive layouts using Grid breakpoints
2. Implement proper spacing and hierarchy
3. Use Typography variants for clear text hierarchy
4. Include interactive elements (buttons, fields)
5. Apply consistent spacing with MUI's system
6. Make interfaces accessible with proper ARIA labels
7. Use color effectively for visual hierarchy
8. Always import icons from @mui/icons-material

Example of a Comprehensive UI:

<Box sx={{ p: 3 }}>
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
</Box>`

function cleanGeneratedCode(code: string, model: string): string {
  // Remove "Generated code:" prefix
  code = code.replace(/^Generated code:\s*/i, '')

  // Remove markdown code blocks if present
  code = code.replace(/```[a-z]*\n/g, '').replace(/```/g, '')
  
  if (model === DEEPTHINK_MODEL) {
    // Remove content between <think> tags for DeepThink model
    code = code.replace(/<think>[\s\S]*?<\/think>/g, '')
  }

  // Remove any text before first import statement
  const importIndex = code.indexOf('import React')
  if (importIndex >= 0) {
    code = code.substring(importIndex)
  }

  // Find the last export default statement and include everything up to it
  const exportIndex = code.lastIndexOf('export default')
  if (exportIndex >= 0) {
    code = code.substring(0, code.indexOf(';', exportIndex) + 1)
  }
  
  // Trim whitespace and remove any extra newlines
  code = code.trim().replace(/\n{3,}/g, '\n\n')
  
  return code
}

export async function getLlamaResponse(prompt: string, useDeepThink: boolean = false) {
  try {
    const model = useDeepThink ? DEEPTHINK_MODEL : DEFAULT_MODEL
    console.log('Using model:', model)

    // First request: Generate the component
    const response = await axios.post('/api/ollama', {
      model,
      prompt: `You are a React expert. Create a UI component following this structure. Return ONLY the component code, NO imports:

function Demo() {
  return (
    // Your implementation here using MUI components
  );
}

Rules:
1. MUST be a function named "PromptAnswer" with no parameters
2. MUST have a return statement with JSX
3. DO NOT include any imports - all components are already available in scope
4. Use ONLY these components (they are already imported):
   - MUI Core: Box, Grid, Paper, Typography, Button, TextField, Card, CardHeader, CardContent, CardActions, Stack, IconButton
   - MUI X Charts: ResponsiveChartContainer, BarPlot, LinePlot, ChartsXAxis
   - MUI X DataGrid: DataGrid, GridToolbar, GridActionsCellItem, GridRowModes, GridRowEditStopReasons
   - MUI X TreeView: TreeView, TreeItem
   - Available icons (MUST use with Icon suffix):
     * Navigation: MenuIcon, ArrowBackIcon, ArrowForwardIcon, ArrowUpwardIcon, ArrowDownwardIcon
     * Actions: AddIcon, DeleteIcon, EditIcon, CloseIcon, SaveIcon, ShareIcon, SearchIcon
     * Status: CheckIcon, ErrorIcon, InfoIcon, WarningIcon, HelpIcon
     * Common: HomeIcon, SettingsIcon, PersonIcon, NotificationsIcon, DashboardIcon
     * Media: PlayArrowIcon, PauseIcon, StopIcon, VolumeUpIcon, VolumeDownIcon
     * Files: FolderIcon, FileIcon, DownloadIcon, UploadIcon, PrintIcon
     * Social: ChatIcon, MailIcon, PhoneIcon, SendIcon
     * StarIcon, FavoriteIcon, LockIcon, UnlockIcon

5. Component Examples:
   - Basic layout:
     <Box sx={{ maxWidth: 'lg', p: 4 }}>
       <Typography variant="h4" gutterBottom>
         Title
       </Typography>
     </Box>

   - Icon usage:
     <IconButton>
       <SettingsIcon />
     </IconButton>

   - Chart and Data Grid usage:
     IMPORTANT: The examples below show the API structure. When implementing charts:
     1. ALWAYS use data that matches the context of the user's request
     2. Use realistic values and labels from the domain
     3. If the prompt mentions specific metrics, use those exact metrics
     4. Data points should reflect real-world patterns
     5. Labels should use domain-specific terminology

     // Chart API Example 1: Combined Charts
     <ResponsiveChartContainer
       series={[
         { type: 'bar', data: [100, 150, 180, 120, 140] },
         { type: 'line', data: [110, 140, 160, 130, 150] },
       ]}
       xAxis={[{
         data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
         scaleType: 'band',
         id: 'months',
       }]}
       height={300}
     >
       <BarPlot />
       <LinePlot />
       <ChartsXAxis label="Monthly Sales" position="bottom" axisId="months" />
     </ResponsiveChartContainer>

     // Single Bar Chart
     <ResponsiveChartContainer
       series={[
         { type: 'bar', data: [35, 45, 40, 50, 42] },
       ]}
       xAxis={[{
         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
         scaleType: 'band',
         id: 'weekdays',
       }]}
       height={300}
     >
       <BarPlot />
       <ChartsXAxis label="Daily Traffic" position="bottom" axisId="weekdays" />
     </ResponsiveChartContainer>

     // Line Chart with Multiple Series
     <ResponsiveChartContainer
       series={[
         { type: 'line', data: [1200, 1800, 2200, 1900, 2500] },
         { type: 'line', data: [300, 450, 500, 400, 600] },
       ]}
       xAxis={[{
         data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
         scaleType: 'band',
         id: 'weeks',
       }]}
       height={300}
     >
       <LinePlot />
       <ChartsXAxis label="Weekly Performance" position="bottom" axisId="weeks" />
     </ResponsiveChartContainer>

     <Box sx={{ height: 400, width: '100%' }}>
       <DataGrid
         rows={[
           { id: 1, name: 'John', age: 35 },
           { id: 2, name: 'Jane', age: 28 }
         ]}
         columns={[
           { field: 'name', headerName: 'Name', width: 130 },
           { field: 'age', headerName: 'Age', width: 90 }
         ]}
         components={{ Toolbar: GridToolbar }}
       />
     </Box>

   - TreeView usage:
     <TreeView defaultExpandIcon={<ChevronRightIcon />} defaultCollapseIcon={<ExpandMoreIcon />}>
       <TreeItem nodeId="1" label="Main">
         <TreeItem nodeId="2" label="Child 1" />
         <TreeItem nodeId="3" label="Child 2" />
       </TreeItem>
     </TreeView>

6. Return ONLY the component code, no explanations or imports

Create a UI for: ${prompt}`,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.data || !response.data.response) {
      throw new Error('Invalid response from Ollama API')
    }

    const generatedCode = cleanGeneratedCode(response.data.response, model)
    return generatedCode

  } catch (error) {
    console.error('Error calling Ollama:', error)
    throw new Error('Failed to generate UI component')
  }
}
