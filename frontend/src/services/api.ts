import type { Health, Prediction } from '../types/api'
const API = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
export async function readHealth(): Promise<Health> {
  const response = await fetch(`${API}/api/v1/health`)
  if (!response.ok) throw new Error(`Server returned ${response.status}`)
  return response.json()
}
export async function predict(file: File, confidence: number): Promise<Prediction> {
  const form = new FormData()
  form.append('file', file)
  const response = await fetch(`${API}/api/v1/detect?confidence=${confidence.toFixed(2)}`, { method: 'POST', body: form })
  if (!response.ok) {
    const raw = await response.json().catch(() => ({}))
    const detail = raw.detail
    throw new Error(typeof detail === 'string' ? detail : `Inference failed (HTTP ${response.status})`)
  }
  return response.json()
}
