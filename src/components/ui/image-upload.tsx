'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onUploadComplete: (imageUrl: string) => void
  maxFiles?: number
  accept?: string
  /** عرض مضغوط: زر فقط بدون منطقة سحب وإفلات */
  compact?: boolean
}

export function ImageUpload({ onUploadComplete, maxFiles = 1, accept = "image/*", compact = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(new Error('failed_to_read_file'))
      reader.readAsDataURL(file)
    })

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return

    const file = files[0]
    
    // تحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة فقط')
      return
    }

    // تحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الملف كبير جداً (الحد الأقصى 5MB)')
      return
    }

    setUploading(true)
    setError('')
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // محاكاة التقدم
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        const data = await response.json()
        onUploadComplete(data.filename)
      } else {
        const errorData = await response.json()
        const serverError = String(errorData?.error || '')
        // fallback: إذا إعدادات التخزين السحابي غير متوفرة، نحفظ الصورة كـ Data URL.
        // هذا يضمن استمرار العمل حتى قبل ضبط متغيرات Firebase.
        if (
          /FIREBASE|FIREBASE_PROJECT_ID|FIREBASE_CLIENT_EMAIL|FIREBASE_PRIVATE_KEY|FIREBASE_STORAGE_BUCKET|إعدادات/i.test(serverError)
        ) {
          const dataUrl = await fileToDataUrl(file)
          if (dataUrl) {
            onUploadComplete(dataUrl)
            setError('تم التحويل لوضع بديل: حُفظت الصورة مباشرة بدون Firebase Storage')
          } else {
            setError('تعذر قراءة الصورة محلياً')
          }
        } else {
          setError(serverError || 'فشل رفع الصورة')
        }
      }
    } catch (error) {
      // fallback أخير لأي خطأ شبكي/خادمي
      try {
        const dataUrl = await fileToDataUrl(file)
        if (dataUrl) {
          onUploadComplete(dataUrl)
          setError('تم التحويل لوضع بديل بسبب خطأ في الرفع')
        } else {
          setError('حدث خطأ أثناء رفع الصورة')
        }
      } catch {
        setError('حدث خطأ أثناء رفع الصورة')
      }
    } finally {
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
      }, 1000)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files)
    }
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 ml-2" />
          {uploading ? 'جاري الرفع...' : 'رفع من الجهاز'}
        </Button>
        {uploading && <Progress value={progress} className="w-full h-1.5" />}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-yellow-500 bg-yellow-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploading ? 'جاري الرفع...' : 'اسحب وأفلت الصورة هنا'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              أو انقر لاختيار ملف
            </p>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 ml-2" />
            اختيار صورة
          </Button>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>جاري الرفع...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500">
        <p>• الصيغ المسموحة: JPG, PNG, WebP, GIF</p>
        <p>• الحجم الأقصى: 5MB</p>
        <p>• عند تعطل Firebase Storage سيتم الحفظ بوضع بديل تلقائياً</p>
      </div>
    </div>
  )
}