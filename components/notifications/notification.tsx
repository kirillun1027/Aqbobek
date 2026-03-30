import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface NotificationProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  onClose?: () => void
}

export function Notification({ type, title, message, onClose }: NotificationProps) {
  const getStyles = (t: string) => {
    switch (t) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  const getIcon = (t: string) => {
    switch (t) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <div className={`border rounded-lg p-4 ${getStyles(type)}`}>
      <div className="flex items-start gap-3">
        {getIcon(type)}
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl opacity-70 hover:opacity-100"
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
