'use client'

import { useState, useRef } from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getLlamaResponse } from '@/lib/ollama'
import { previewScope } from '@/lib/preview-scope'
import * as Switch from '@radix-ui/react-switch'
import { Label } from '@radix-ui/react-label'

const DEFAULT_CODE = `<Box sx={{ p: 2 }}>
  <Typography variant="h4" gutterBottom>
    Welcome!
  </Typography>
  <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
    Describe your UI in the text area above and click Generate UI.
  </Typography>
</Box>`

const editorStyles = {
  fontSize: 12,
  fontFamily: '"Fira Code", monospace',
  padding: '8px',
}

export function TextToUIInterface() {
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState(DEFAULT_CODE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showComponents, setShowComponents] = useState(false)
  const [useDeepThink, setUseDeepThink] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  const generateUI = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getLlamaResponse(prompt, useDeepThink)
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
    <div className="grid grid-cols-[400px_1fr] gap-8 min-h-[calc(100vh-12rem)]">
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
              <div className="flex items-center justify-between">
                <Button
                  onClick={generateUI}
                  disabled={loading}
                  className="flex-1 mr-4"
                >
                  {loading ? 'Generating...' : 'Generate UI'}
                </Button>
                <div className="flex items-center space-x-2">
                  <Switch.Root
                    checked={useDeepThink}
                    onCheckedChange={setUseDeepThink}
                    id="deepthink-mode"
                    className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-primary outline-none cursor-default"
                  >
                    <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                  <Label htmlFor="deepthink-mode" className="text-sm font-medium leading-none cursor-pointer">
                    DeepThink
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <LiveEditor style={editorStyles} />
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
