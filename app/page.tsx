'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [input, setInput] = useState('')
  const [article, setArticle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateArticle = async () => {
    if (!input.trim()) {
      setError('入力内容を入力してください')
      return
    }

    setLoading(true)
    setError('')
    setArticle('')

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      })

      if (!response.ok) {
        throw new Error('記事生成に失敗しました')
      }

      const data = await response.json()
      setArticle(data.article)
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    setInput('')
    setArticle('')
    setError('')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(article)
      alert('記事をクリップボードにコピーしました！')
    } catch (err) {
      alert('コピーに失敗しました')
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          AI記事生成アプリ
        </h1>

        <p className={styles.description}>
          記事にしたい内容を入力してください
        </p>

        <div className={styles.inputSection}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例: 人工知能の未来について、環境問題の解決策、健康的な生活習慣など..."
            rows={4}
            className={styles.textarea}
            disabled={loading}
          />
          
          <div className={styles.buttons}>
            <button
              onClick={generateArticle}
              disabled={loading || !input.trim()}
              className={`${styles.button} ${styles.generateButton}`}
            >
              {loading ? '記事生成中...' : '記事を生成'}
            </button>
            
            <button
              onClick={clearAll}
              className={`${styles.button} ${styles.clearButton}`}
              disabled={loading}
            >
              クリア
            </button>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            <p>エラー: {error}</p>
          </div>
        )}

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>記事を生成しています...</p>
          </div>
        )}

        {article && (
          <div className={styles.articleSection}>
            <h2>生成された記事</h2>
            <div className={styles.article}>
              <pre>{article}</pre>
            </div>
            <button
              onClick={copyToClipboard}
              className={`${styles.button} ${styles.copyButton}`}
            >
              記事をコピー
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
