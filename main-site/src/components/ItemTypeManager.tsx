'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ItemTypeManagerProps {
  onClose: () => void
  onTypeCreated: () => void
}

const EMOJI_OPTIONS = ['📦', '🔧', '⚙️', '🏷️', '📋', '🔩', '⚡', '🎨', '💡', '🔨', '🛠️', '📐', '🎯']
const COLOR_OPTIONS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Indigo', value: '#6366F1' },
]

export default function ItemTypeManager({ onClose, onTypeCreated }: ItemTypeManagerProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📦')
  const [color, setColor] = useState('#3B82F6')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const supabase = createClient()

  async function handleCreate() {
    if (!name.trim()) {
      setError('Please enter a type name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase
        .from('item_types')
        .insert({
          user_id: user.id,
          name: name.trim(),
          icon,
          color,
          is_system: false
        })

      if (insertError) throw insertError

      onTypeCreated()
      onClose()
    } catch (err: any) {
      console.error('Error creating type:', err)
      if (err.code === '23505') {
        setError('A type with this name already exists')
      } else {
        setError('Failed to create type')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create Custom Item Type</h2>
          <p className="text-sm text-gray-500 mt-1">Add a new category for your items</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Packaging Box, Raw Material, Tool..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-7 gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                    icon === emoji
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map(colorOption => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setColor(colorOption.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    color === colorOption.value
                      ? 'border-gray-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                >
                  <span className="text-white text-xs font-medium">
                    {colorOption.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <div 
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-white font-medium"
              style={{ backgroundColor: color }}
            >
              <span className="mr-2">{icon}</span>
              <span>{name || 'Type Name'}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Type'}
          </button>
        </div>
      </div>
    </div>
  )
}
