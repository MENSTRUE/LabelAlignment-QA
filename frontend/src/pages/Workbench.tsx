import { useEffect, useRef, useState } from 'react'
import { Activity, ArrowUpRight, CheckCircle2, Download, FileImage, Gauge, Layers3, ScanLine, ShieldAlert, SlidersHorizontal, UploadCloud, X } from 'lucide-react'
import { predict, readHealth } from '../services/api'
import type { Health, Prediction } from '../types/api'

const LABELS: Record<number, { short: string, tone: string }> = {
  0: { short: 'Imperfect label', tone: 'amber' },
  1: { short: 'No label', tone: 'rose' },
  2: { short: 'Perfect label', tone: 'teal' }
}
const maxSize = 10 * 1024 * 1024
const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp']

export default function Workbench() {
  const [health, setHealth] = useState<Health | null>(null)
  const [online, setOnline] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [confidence, setConfidence] = useState(0.25)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const picker = useRef<HTMLInputElement>(null)
  const controller = useRef<AbortController | null>(null)

  useEffect(() => {
    let active = true
    readHealth().then(h => { if (active) { setHealth(h); setOnline(true) } })
      .catch(() => { if (active) setOnline(false) })
    return () => { active = false; controller.current?.abort() }
  }, [])
  useEffect(() => {
    if (!file) { setImageUrl(null); return }
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function choose(next: File | undefined) {
    if (!next) return
    if (!allowed.includes(next.type)) { setError('Use JPG, PNG, WebP or BMP.'); return }
    if (next.size > maxSize) { setError('File is too large. Maximum 10 MB.'); return }
    setFile(next); setPrediction(null); setError(null)
  }
  async function inspect() {
    if (!file) return
    setBusy(true); setError(null); setPrediction(null)
    try { setPrediction(await predict(file, confidence)) }
    catch (err) { setError(err instanceof Error ? err.message : 'Unexpected inference error') }
    finally { setBusy(false) }
  }
  function clear() { setFile(null); setPrediction(null); setError(null); if (picker.current) picker.current.value = '' }
  function exportReport() {
    if (!prediction) return
    const payload = { model_name: prediction.model_name, model_available: prediction.model_available, image_width: prediction.image_width, image_height: prediction.image_height, detections: prediction.detections, inference_ms: prediction.inference_ms, disclaimer: prediction.disclaimer, inspected_filename: file?.name, note: 'Research detections, not certified QA.', exported_at: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'labelalignment-inspection.json'; a.click()
    URL.revokeObjectURL(url)
  }
  const counts = prediction ? [0, 1, 2].map(i => prediction.detections.filter(d => d.class_id === i).length) : [0, 0, 0]
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon"><ScanLine size={22}/></div><div><strong>labelalignment<span>.</span></strong><small>VISION QUALITY LAB</small></div></div>
        <div className="sidebar-heading">WORKSPACE</div>
        <div className="nav active"><Layers3 size={18}/> Inspection studio <span className="nav-number">01</span></div>
        <div className="nav muted"><Activity size={18}/> Research baseline</div>
        <div className="sidebar-spacer"/>
        <div className="side-note"><ShieldAlert size={17}/><p><strong>Research prototype</strong><br/>Class predictions are not calibrated manufacturing pass/fail decisions.</p></div>
        <div className="sidebar-bottom">DAY 24 <span>/</span> 100 PROJECTS</div>
      </aside>
      <main className="main">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> Computer vision <span>/</span> <b>Inspection studio</b></div><div className={`connection ${online ? 'on' : 'off'}`}><span className="dot"/>{online ? 'API CONNECTED' : 'API OFFLINE'}</div></header>
        <div className="content">
          <div className="headline"><div><div className="eyebrow"><span className="eyebrow-line"/> MACHINE VISION · EXPERIMENT 024</div><h1>Precision starts<br/><em>with visibility.</em></h1><p>Explore bottle label conditions with a real YOLOv8 research model. Upload an image to see source-defined detections and model confidence.</p></div><div className="headline-mark"><ScanLine size={58} strokeWidth={1}/><span>LV / 024</span></div></div>
          <div className="stats"><div><span>MODEL ARCHITECTURE</span><strong>YOLOv8n</strong><small>Object detection</small></div><div><span>SOURCE CLASSES</span><strong>03</strong><small>Dataset-defined</small></div><div><span>CHECKPOINT</span><strong className={health?.model.checkpoint_found ? 'good' : 'warn'}>{health?.model.checkpoint_found ? 'Detected' : 'Missing'}</strong><small>{health?.model.loaded ? 'Loaded into memory' : 'Lazy loading'}</small></div><div><span>INSPECTION MODE</span><strong>Research</strong><small>Not certified QA</small></div></div>
          <div className="section-title"><span>01</span><h2>Inspection workspace</h2><p>Upload · Analyze · Review</p></div>
          <div className="workgrid">
            <section className="panel upload-panel"><div className="panel-top"><h3><UploadCloud size={17}/> Input image</h3><span>JPG / PNG / WEBP / BMP</span></div>
              <input ref={picker} type="file" accept="image/jpeg,image/png,image/webp,image/bmp" hidden onChange={e => choose(e.target.files?.[0])}/>
              {!file ? <div className={`dropzone ${dragging ? 'dragging' : ''}`} onDragEnter={e => {e.preventDefault(); setDragging(true)}} onDragOver={e=>e.preventDefault()} onDragLeave={e=>{e.preventDefault();setDragging(false)}} onDrop={e=>{e.preventDefault();setDragging(false);choose(e.dataTransfer.files[0])}} onClick={()=>picker.current?.click()} role="button" tabIndex={0} onKeyDown={e => {if (e.key==='Enter') picker.current?.click()}}><div className="upload-icon"><FileImage size={32}/></div><strong>Drop your image here</strong><p>or click to browse your files</p><small>Maximum 10 MB · Original quality retained</small><button type="button" onClick={e=>{e.stopPropagation();picker.current?.click()}}>Choose an image <ArrowUpRight size={16}/></button></div> : <div className="input-preview"><img src={imageUrl ?? ''} alt="Selected upload preview"/><div className="preview-footer"><span><FileImage size={16}/><b title={file.name}>{file.name}</b><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></span><button title="Remove image" onClick={clear}><X size={18}/></button></div></div>}
              <div className="controls"><div className="control-head"><span><SlidersHorizontal size={16}/> Confidence threshold</span><b>{Math.round(confidence * 100)}%</b></div><input aria-label="Confidence threshold" type="range" min={5} max={95} value={Math.round(confidence*100)} onChange={e=>setConfidence(Number(e.target.value)/100)}/><div className="range-ends"><span>More detections</span><span>Higher certainty</span></div><button className="primary" disabled={!file || busy} onClick={inspect}><ScanLine size={18}/>{busy ? 'Running inference…' : 'Run inspection'}<ArrowUpRight size={16}/></button>{error && <p role="alert" className="error">{error}</p>}</div>
            </section>
            <section className="panel result-panel"><div className="panel-top"><h3><ScanLine size={17}/> Detection preview</h3><span>{prediction ? `${prediction.image_width} × ${prediction.image_height}px` : 'AWAITING ANALYSIS'}</span></div><div className={`result-viewport ${prediction ? 'has-result' : ''}`}>{prediction ? <img src={`data:image/jpeg;base64,${prediction.preview_jpeg_base64}`} alt="Model detected bounding boxes on uploaded image"/> : <div className="empty-result"><div className="scan-illustration"><ScanLine size={68} strokeWidth={0.8}/><span className="scan-axis"/></div><strong>Awaiting your image</strong><p>Inspection results will appear here after the model processes your image.</p></div>}</div><div className="result-footer"><div className="mini-status"><span className={`mini-dot ${prediction ? 'active' : ''}`}/>{prediction ? `${prediction.detections.length} detection(s) · ${prediction.inference_ms.toFixed(1)} ms` : 'No analysis performed yet'}</div><button disabled={!prediction} onClick={exportReport}><Download size={16}/> Export JSON</button></div></section>
          </div>
          <div className="section-title lower"><span>02</span><h2>Inspection summary</h2><p>Source-defined classes</p></div>
          <div className="summary-grid">{[0,1,2].map(i=><div className={`summary-card tone-${LABELS[i].tone}`} key={i}><div className="summary-icon">{i===2?<CheckCircle2 size={22}/>:i===1?<ShieldAlert size={22}/>:<Gauge size={22}/>}</div><div><span>{LABELS[i].short}</span><strong>{prediction ? String(counts[i]).padStart(2,'0') : '—'}</strong></div><small>{prediction ? 'Model detections' : 'Awaiting result'}</small></div>)}</div>
          <p className="disclaimer">{prediction?.disclaimer || 'Detection classes reflect original dataset annotations. No physical label angle, lateral offset, or manufacturing acceptance criterion is measured.'}</p>
          <footer>LABELALIGNMENT QA · EXPERIMENTAL INSPECTION SYSTEM <span>DESIGNED FOR EVIDENCE, NOT ASSUMPTIONS.</span></footer>
        </div>
      </main>
    </div>
  )
}
