'use client'

import * as React from 'react'
import {
  Box,
  Container,
  Stack,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Paper,
  IconButton,
} from '@mui/material'

// Helper components that will be available in the preview
function PreviewContainer({ children }) {
  return (
    <Box sx={{ py: 2 }}>
      <Stack spacing={2}>
        {children}
      </Stack>
    </Box>
  )
}

// Export all components and utilities that should be available in the preview
export const previewScope = {
  // React
  React,
  
  // Layout Components
  Box,
  Container,
  Stack,
  Grid,
  Paper,
  
  // Content Components
  Typography,
  Button,
  TextField,
  IconButton,
  
  // Card Components
  Card,
  CardContent,
  CardHeader,
  CardActions,
  
  // Helper Components
  PreviewContainer,
}
