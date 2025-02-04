import { NextResponse } from 'next/server'
import axios from 'axios'

const OLLAMA_API = 'http://192.168.0.140:11434'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('🔄 Proxying request to Ollama:', {
            model: body.model,
            prompt_length: body.prompt?.length,
        })

        // First check if the model exists
        try {
            await axios.get(`${OLLAMA_API}/api/tags`)
        } catch (error) {
            console.error('❌ Failed to connect to Ollama server:', error)
            return NextResponse.json(
                { error: 'Failed to connect to Ollama server. Make sure it is running.' },
                { status: 503 }
            )
        }

        const response = await axios.post(`${OLLAMA_API}/api/generate`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000, // Increased timeout to 30 seconds
        })

        console.log('✅ Received response from Ollama:', {
            response_length: response.data?.response?.length,
            status: response.status,
        })
        
        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('❌ Error in Ollama proxy:', {
            message: error.message,
            response_status: error.response?.status,
            response_data: error.response?.data,
        })

        // Handle specific error cases
        if (error.code === 'ECONNREFUSED') {
            return NextResponse.json(
                { error: 'Could not connect to Ollama server' },
                { status: 503 }
            )
        }

        if (error.response?.status === 404) {
            return NextResponse.json(
                { error: 'Model not found. Make sure the model is installed.' },
                { status: 404 }
            )
        }

        if (error.response?.status === 408 || error.code === 'ETIMEDOUT') {
            return NextResponse.json(
                { error: 'Request timed out. The model might be too slow or overloaded.' },
                { status: 408 }
            )
        }

        return NextResponse.json(
            { 
                error: error.message,
                details: error.response?.data || 'No additional details'
            }, 
            { status: error.response?.status || 500 }
        )
    }
}
