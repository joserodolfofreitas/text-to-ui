import { NextResponse } from 'next/server'
import axios from 'axios'

const OLLAMA_API = 'http://192.168.0.140:11434'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('🔄 Proxying request to Ollama:', body)

        const response = await axios.post(`${OLLAMA_API}/api/generate`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        })

        console.log('✅ Received response from Ollama')
        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('❌ Error in Ollama proxy:', error)
        return NextResponse.json(
            { 
                error: error.message,
                details: error.response?.data || 'No additional details'
            }, 
            { status: error.response?.status || 500 }
        )
    }
}
