'use client'

import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  label?: string
  error?: string
  isLoading?: boolean
  disabled?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  label,
  error,
  isLoading = false,
  disabled = false,
}) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoading || disabled) return
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoading || disabled) return
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || disabled) return
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (file: File) => {
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
      return
    }

    if (!accept.split(',').some(ext => file.name.toLowerCase().endsWith(ext.trim().replace('.', '')))) {
      alert(`File must be of type: ${accept}`)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleClear = () => {
    if (isLoading || disabled) return
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold mb-2 text-white">{label}</label>}

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            isLoading || disabled ? 'border-slate/30 bg-slate/5 cursor-not-allowed' : isDragActive ? 'border-blue bg-blue/10' : 'border-blue/30 hover:border-blue/50'
          } ${error ? 'border-rose' : ''}`}
          onClick={() => !isLoading && !disabled && fileInputRef.current?.click()}
        >
          {isLoading ? (
            <>
              <div className="w-12 h-12 mx-auto mb-3 border-4 border-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-white font-semibold mb-1">Processing CV...</p>
              <p className="text-slate-400">This may take a moment</p>
            </>
          ) : (
            <>
              <Upload className={`w-12 h-12 mx-auto mb-3 ${disabled ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`font-semibold mb-1 ${disabled ? 'text-slate-600' : 'text-white'}`}>Drag and drop your file here</p>
              <p className={disabled ? 'text-slate-600' : 'text-slate-400'}>or click to browse</p>
              <p className="text-slate-500 text-sm mt-2">PDF files up to {maxSize / (1024 * 1024)}MB</p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={isLoading || disabled}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-emerald/50 bg-emerald/10 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald/20 rounded flex items-center justify-center">
              <span className="text-emerald font-semibold">✓</span>
            </div>
            <div>
              <p className="text-white font-semibold">{selectedFile.name}</p>
              <p className="text-slate-400 text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {error && <p className="text-rose text-sm mt-2">{error}</p>}
    </div>
  )
}
