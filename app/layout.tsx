import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI記事生成アプリ',
  description: 'OpenAI APIを使用した記事生成アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
