// components/ItemFormModal.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Item, ItemType, CreateItemInput } from '@/types/items';
import { motion } from 'framer-motion';

export function ItemFormModal({ 
  item, 
  onClose, 
  onSuccess 
}: { 
  item?: Item; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<CreateItemInput>({
    sku: item?.sku || '',
    name: item?.name || '',
    description: item?.description || '',
    item_type: item?.item_type || 'part',
    track_inventory: item?.track_inventory ?? true,
    current_stock: item?.current_stock || 0,
    min_stock_level: item?.min_stock_level || 0,
    can_sell: item?.can_sell || false,
    sell_price: item?.sell_price || undefined,
    cost_price: item?.cost_price || undefined,
    unit: item?.unit || 'unit',
    notes: item?.notes || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (item) {
        const { error } = await supabase
          .from('items')
          .update(formData)
          .eq('id', item.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('items')
          .insert([formData]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving item:', error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const typeConfig = [
    { value: 'part', label: 'Part', icon: '⚙️', desc: 'Raw material or basic component' },
    { value: 'component', label: 'Component', icon: '🔧', desc: 'Manufactured sub-assembly' },
    { value: 'assembly', label: 'Assembly', icon: '🏗️', desc: 'Complete assembled unit' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            {item ? '✏️ Edit Item' : '✨ Create New Item'}
          </h2>
          <p className="text-white/80">
            {item ? 'Update item details' : 'Add a new item to your inventory'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Item Type Selection - Visual Cards */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Item Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {typeConfig.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, item_type: type.value as ItemType })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.item_type === type.value
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="font-bold text-slate-900">{type.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* SKU & Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  SKU * 🏷️
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono transition-all"
                  placeholder="PART-001"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Name * 📝
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Detent Ball"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description 📄
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                placeholder="Detailed description of this item..."
              />
            </div>

            {/* Stock Management */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  📊 Stock Management
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.track_inventory}
                    onChange={(e) => setFormData({ ...formData, track_inventory: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-slate-700">Track Inventory</span>
                </label>
              </div>

              {formData.track_inventory && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.current_stock}
                      onChange={(e) => setFormData({ ...formData, current_stock: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Min Stock Level
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.min_stock_level}
                      onChange={(e) => setFormData({ ...formData, min_stock_level: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="unit, kg, meter"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  💰 Pricing & Sales
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.can_sell}
                    onChange={(e) => setFormData({ ...formData, can_sell: e.target.checked })}
                    className="w-5 h-5 text-green-600 border-slate-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-semibold text-slate-700">Can Sell</span>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sell Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sell_price || ''}
                    onChange={(e) => setFormData({ ...formData, sell_price: parseFloat(e.target.value) || undefined })}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="99.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost_price || ''}
                    onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || undefined })}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="49.99"
                  />
                </div>
              </div>

              {formData.sell_price && formData.cost_price && (
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Profit Margin:</span>
                    <span className="font-bold text-green-600">
                      ${(formData.sell_price - formData.cost_price).toFixed(2)} 
                      ({(((formData.sell_price - formData.cost_price) / formData.cost_price) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Notes 📝
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                placeholder="Additional notes or specifications..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t-2 border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '⏳ Saving...' : item ? '💾 Update Item' : '✨ Create Item'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
