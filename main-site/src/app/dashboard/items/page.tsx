'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Item, ItemType, ItemsFilter } from '@/types/items';
import { motion, AnimatePresence } from 'framer-motion';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<ItemsFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, filter, searchTerm]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
      showToast('Failed to load items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    if (filter.item_type) {
      filtered = filtered.filter(item => item.item_type === filter.item_type);
    }

    if (filter.can_sell !== undefined) {
      filtered = filtered.filter(item => item.can_sell === filter.can_sell);
    }

    if (filter.low_stock) {
      filtered = filtered.filter(item => 
        item.track_inventory && item.available_stock <= item.min_stock_level
      );
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.sku.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      );
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) throw error;
      
      await loadItems();
      showToast('Item deleted successfully', 'success');
    } catch (error: any) {
      showToast(`Failed to delete: ${error.message}`, 'error');
    }
  };

  const stats = {
    total: items.length,
    components: items.filter(i => i.item_type === 'component').length,
    parts: items.filter(i => i.item_type === 'part').length,
    assemblies: items.filter(i => i.item_type === 'assembly').length,
    lowStock: items.filter(i => i.track_inventory && i.available_stock <= i.min_stock_level).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Items Management
          </h1>
          <p className="text-slate-600 text-lg">Internal inventory - Parts, Components & Assemblies</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard label="Total" value={stats.total} icon="📦" gradient="from-blue-500 to-cyan-500" delay={0} />
          <StatsCard label="Parts" value={stats.parts} icon="⚙️" gradient="from-yellow-500 to-orange-500" delay={0.1} />
          <StatsCard label="Components" value={stats.components} icon="🔧" gradient="from-purple-500 to-pink-500" delay={0.2} />
          <StatsCard label="Assemblies" value={stats.assemblies} icon="🏗️" gradient="from-indigo-500 to-purple-500" delay={0.3} />
          <StatsCard label="Low Stock" value={stats.lowStock} icon="⚠️" gradient="from-red-500 to-rose-500" delay={0.4} pulse={stats.lowStock > 0} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="text-slate-400 group-focus-within:text-indigo-500 transition-colors">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search by SKU, name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <select
              value={filter.item_type || ''}
              onChange={(e) => setFilter({ ...filter, item_type: e.target.value as ItemType || undefined })}
              className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            >
              <option value="">All Types</option>
              <option value="part">⚙️ Parts</option>
              <option value="component">🔧 Components</option>
              <option value="assembly">🏗️ Assemblies</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105 active:scale-95"
            >
              ✨ Add Item
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <LoadingState />
        ) : filteredItems.length === 0 ? (
          <EmptyState hasFilters={!!searchTerm || !!filter.item_type} />
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                index={index}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDelete(item.id, item.name)}
              />
            ))}
          </div>
        )}

        {(showAddModal || editingItem) && (
          <SimpleItemForm
            onClose={() => {
              setShowAddModal(false);
              setEditingItem(null);
            }}
            onSuccess={() => {
              loadItems();
              setShowAddModal(false);
              setEditingItem(null);
              showToast(editingItem ? 'Item updated' : 'Item created', 'success');
            }}
            editItem={editingItem || undefined}
          />
        )}

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <div className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border-2 ${
                toast.type === 'success'
                  ? 'bg-green-500/90 border-green-400 text-white'
                  : 'bg-red-500/90 border-red-400 text-white'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{toast.type === 'success' ? '✓' : '✕'}</span>
                  <span className="font-semibold">{toast.message}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Simple Item Form - No external dependencies
function SimpleItemForm({ onClose, onSuccess, editItem }: any) {
  const [formData, setFormData] = useState({
    name: editItem?.name || '',
    sku: editItem?.sku || '',
    description: editItem?.description || '',
    item_type: editItem?.item_type || 'part',
    current_stock: editItem?.current_stock || 0,
    min_stock: editItem?.min_stock || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const itemData = {
        ...formData,
        user_id: user.id,
        store_id: 'default',
      };

      if (editItem) {
        const { error } = await supabase
          .from('items')
          .update(itemData)
          .eq('id', editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('items')
          .insert([itemData]);
        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">
          <h2 className="text-2xl font-bold">{editItem ? 'Edit Item' : 'Create Item'}</h2>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SKU *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type *</label>
            <select
              value={formData.item_type}
              onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="part">⚙️ Part</option>
              <option value="component">🔧 Component</option>
              <option value="assembly">🏗️ Assembly</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Stock</label>
              <input
                type="number"
                value={formData.current_stock}
                onChange={(e) => setFormData({ ...formData, current_stock: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Min Stock</label>
              <input
                type="number"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function StatsCard({ label, value, icon, gradient, delay, pulse = false }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all ${pulse ? 'animate-pulse' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-8 -mt-8`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{icon}</span>
          <span className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</span>
        </div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </motion.div>
  );
}

function ItemCard({ item, index, onEdit, onDelete }: any) {
  const typeConfig = {
    part: { icon: '⚙️', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
    component: { icon: '🔧', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
    assembly: { icon: '🏗️', color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50' },
  }[item.item_type] || { icon: '📦', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' };

  const isLowStock = item.track_inventory && item.available_stock <= item.min_stock_level;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className={`flex-shrink-0 w-16 h-16 rounded-xl ${typeConfig.bg} flex items-center justify-center text-3xl`}>
          {typeConfig.icon}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${typeConfig.color}`}>
              {item.item_type}
            </span>
            {isLowStock && <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">⚠️ Low Stock</span>}
          </div>
          <p className="text-sm text-slate-600">SKU: <span className="font-mono font-semibold">{item.sku}</span></p>
          {item.description && <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>}
        </div>

        {item.track_inventory && (
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">Current</p>
              <p className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>{item.current_stock}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Available</p>
              <p className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>{item.available_stock}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onEdit} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 font-semibold">✏️ Edit</button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-semibold">🗑️</button>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white/80 rounded-2xl shadow-lg p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 rounded-2xl shadow-lg p-16 text-center"
    >
      <div className="text-8xl mb-6">📭</div>
      <h3 className="text-2xl font-bold mb-2">{hasFilters ? 'No items match' : 'No items yet'}</h3>
      <p className="text-slate-600">{hasFilters ? 'Try different filters' : 'Add your first item'}</p>
    </motion.div>
  );
}
