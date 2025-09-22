import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json()

    if (!input) {
      return NextResponse.json(
        { message: '入力内容が必要です' },
        { status: 400 }
      )
    }

    // OpenAI APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY環境変数が設定されていません')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'あなたは優秀なライターです。与えられたトピックについて、構造化された読みやすい記事を日本語で書いてください。見出しを使って内容を整理し、読者にとって価値のある情報を提供してください。'
          },
          {
            role: 'user',
            content: `次のトピックについて記事を書いてください: ${input}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const article = data.choices[0]?.message?.content || '記事の生成に失敗しました。'

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error generating article:', error)
    return NextResponse.json(
      { 
        message: 'サーバーエラーが発生しました',
        error: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    )
  }
}
