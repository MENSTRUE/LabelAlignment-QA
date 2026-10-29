export interface Detection { class_id: number; class_name: string; confidence: number; xyxy: [number, number, number, number] }
export interface Prediction { model_name: string; model_available: boolean; image_width: number; image_height: number; detections: Detection[]; inference_ms: number; preview_jpeg_base64: string; disclaimer: string }
export interface ModelStatus { loaded: boolean; checkpoint_found: boolean; checkpoint_path: string; classes: Record<string, string> | null; reason: string | null }
export interface Health { status: string; model: ModelStatus }
