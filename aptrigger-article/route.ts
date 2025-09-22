// app/api/trigger-article/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ message: 'トピックが必要です' }, { status: 400 });
    }

    // 内部的に記事生成APIを呼び出す
    const response = await fetch('http://localhost:3000/api/generate-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: topic }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '記事生成に失敗しました');
    }

    const data = await response.json();
    return NextResponse.json({ article: data.article });

  } catch (error) {
    console.error('Trigger API Error:', error);
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
}
