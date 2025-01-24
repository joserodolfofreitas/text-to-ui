'use client'

import { useState, useRef } from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getLlamaResponse } from '@/lib/ollama'
import { previewScope } from '@/lib/preview-scope'

const DEFAULT_CODE = `<Box sx={{ p: 2 }}>
  <Typography variant="h4" gutterBottom>
    Welcome!
  </Typography>
  <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
    Describe your UI in the text area above and click Generate UI.
  </Typography>
</Box>`

export function TextToUIInterface() {
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState(DEFAULT_CODE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showComponents, setShowComponents] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  const generateUI = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getLlamaResponse(prompt)
      console.log('Generated code:', response)
      setCode(response)
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        setError('Could not connect to Ollama. Make sure it is running and accessible.')
      } else {
        setError(error.message || 'An error occurred while generating the UI')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentCode = e.dataTransfer.getData('text/plain')
    if (!componentCode) return
    setCode(componentCode)
  }

  return (
    <div className="grid grid-cols-[300px_1fr] gap-8 min-h-[calc(100vh-12rem)]">
      <LiveProvider code={code} scope={previewScope} noInline={false}>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Text to UI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-[120px] w-full"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the UI you want to generate..."
              />
              {error && (
                <div className="text-sm text-destructive">{error}</div>
              )}
              <Button
                onClick={generateUI}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate UI'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <LiveEditor />
              </div>
              <div className="text-destructive mt-2">
                <LiveError />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="relative">
          <Card ref={dropRef} className="h-[calc(100vh-2rem)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Preview</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2"
                onClick={() => setShowComponents(!showComponents)}
              >
                Components {showComponents ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded-lg p-4 min-h-[300px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <LivePreview />
              </div>
            </CardContent>
          </Card>
        </div>
      </LiveProvider>
    </div>
  )
}
