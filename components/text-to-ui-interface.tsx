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

// Debug scope
console.log('Available in scope:', Object.keys(previewScope).sort())

const DEFAULT_CODE = `function hello() {
  return (
    <Box maxWidth="lg">
      <Typography variant="h4" gutterBottom> 
        Empty
      </Typography>
    </Box>
  );
}`

const editorStyles = {
  fontSize: 12,
  fontFamily: '"Fira Code", monospace',
  padding: '8px',
}

export function TextToUIInterface() {
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState(DEFAULT_CODE)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showComponents, setShowComponents] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [useDeepThink, setUseDeepThink] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  const generateUI = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentCode = e.dataTransfer.getData('text/plain')
    if (!componentCode) return
    setCode(componentCode)
  }

  // Add error handling for scope
  const handleError = (error: Error) => {
    console.error('LiveProvider error:', error)
    console.log('Current scope:', Object.keys(previewScope).sort())
  }

  return (
    <div className="grid grid-cols-[400px_1fr] gap-8 min-h-[calc(100vh-12rem)]">
      <LiveProvider 
        code={code} 
        scope={previewScope} 
        noInline={false}
        transformCode={(code) => {
          console.log('Code being rendered:', code)
          console.log('Full scope:', previewScope)
          console.log('Scope keys:', Object.keys(previewScope).sort())
          return code
        }}
        onError={(error) => {
          console.error('LiveProvider error:', error)
          console.log('Full scope at error:', previewScope)
          handleError(error)
        }}
      >
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Text to UI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-[10px] w-full"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the UI you want to generate"
              />
              {error && (
                <div className="text-sm text-destructive">Error: {error}</div>
              )}
              <div className="flex items-center justify-between">
                <Button
                  onClick={generateUI}
                  disabled={isLoading}
                  className="flex-1 mr-4"
                >
                  {isLoading ? 'Generating...' : 'Generate UI'}
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Code</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            {showCode && (
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <LiveEditor style={editorStyles} />
                </div>
                <div className="text-destructive mt-2 space-y-2">
                  <LiveError />
                </div>
              </CardContent>
            )}
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
            <CardContent className="overflow-hidden">
              <div 
                className="border rounded-lg p-4 min-h-[300px] overflow-auto max-h-[calc(100vh-12rem)]"
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
