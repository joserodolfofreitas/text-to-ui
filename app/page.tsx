import { TextToUIInterface } from '@/components/text-to-ui-interface'

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Text to UI Generator</h1>
      <p className="text-muted-foreground mb-8">Generate UI components from natural language descriptions</p>
      <TextToUIInterface />
    </main>
  )
}
