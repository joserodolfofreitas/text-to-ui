'use client'

import React from 'react'
import { Card, CardContent, CardHeader, Typography, Stack, Box } from '@mui/material'

const components = [
  {
    name: 'Button',
    description: 'A basic button component',
    code: '<Button variant="contained">Click me</Button>'
  },
  {
    name: 'Card',
    description: 'A surface for grouping related content',
    code: `<Card>
  <CardHeader title="Card Title" />
  <CardContent>
    <Typography>Card content goes here</Typography>
  </CardContent>
</Card>`
  },
  {
    name: 'TextField',
    description: 'An input field for text',
    code: '<TextField label="Label" placeholder="Enter text" />'
  },
]

export function ComponentRegistry() {
  const handleDragStart = (e: React.DragEvent, code: string) => {
    e.dataTransfer.setData('text/plain', code)
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Components
      </Typography>
      {components.map((component) => (
        <Card
          key={component.name}
          draggable
          onDragStart={(e) => handleDragStart(e, component.code)}
          sx={{
            cursor: 'move',
            '&:hover': {
              boxShadow: (theme) => theme.shadows[4],
            },
            transition: 'box-shadow 0.2s',
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              {component.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {component.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
