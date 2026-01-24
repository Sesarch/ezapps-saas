'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Item, ItemType, ItemsFilter, CreateItemInput } from '@/types/items';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedItemForm from '@/components/EnhancedItemForm';

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

  // Auto-hide toast
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
        {/* Header */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard label="Total" value={stats.total} icon="📦" gradient="from-blue-500 to-cyan-500" delay={0} />
          <StatsCard label="Parts" value={stats.parts} icon="⚙️" gradient="from-yellow-500 to-orange-500" delay={0.1} />
          <StatsCard label="Components" value={stats.components} icon="🔧" gradient="from-purple-500 to-pink-500" delay={0.2} />
          <StatsCard label="Assemblies" value={stats.assemblies} icon="🏗️" gradient="from-indigo-500 to-purple-500" delay={0.3} />
          <StatsCard label="Low Stock" value={stats.lowStock} icon="⚠️" gradient="from-red-500 to-rose-500" delay={0.4} pulse={stats.lowStock > 0} />
        </div>

        {/* Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
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

            {/* Type Filter */}
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

            {/* Sellable Filter */}
            <select
              value={filter.can_sell === undefined ? '' : filter.can_sell.toString()}
              onChange={(e) => setFilter({ 
                ...filter, 
                can_sell: e.target.value === '' ? undefined : e.target.value === 'true' 
              })}
              className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            >
              <option value="">All Items</option>
              <option value="true">💰 Sellable</option>
              <option value="false">🔒 Not Sellable</option>
            </select>

            {/* Low Stock Toggle */}
            <button
              onClick={() => setFilter({ ...filter, low_stock: !filter.low_stock })}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter.low_stock
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/50'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter.low_stock ? '✓ Low Stock' : 'Low Stock'}
            </button>

            {/* Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105 active:scale-95"
            >
              ✨ Add Item
            </button>
          </div>
        </motion.div>

        {/* Items Grid/Table */}
        {isLoading ? (
          <LoadingState />
        ) : filteredItems.length === 0 ? (
          <EmptyState hasFilters={!!searchTerm || !!filter.item_type || filter.can_sell !== undefined || !!filter.low_stock} />
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

        {/* Enhanced Modal */}
        {(showAddModal || editingItem) && (
          <EnhancedItemForm
            onClose={() => {
              setShowAddModal(false);
              setEditingItem(null);
            }}
            onSuccess={() => {
              loadItems();
              setShowAddModal(false);
              setEditingItem(null);
              showToast(editingItem ? 'Item updated successfully' : 'Item created successfully', 'success');
            }}
            editItem={editingItem || undefined}
          />
        )}

        {/* Toast */}
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

// Modern Stats Card with animation
function StatsCard({ 
  label, 
  value, 
  icon, 
  gradient, 
  delay,
  pulse = false 
}: { 
  label: string; 
  value: number; 
  icon: string; 
  gradient: string;
  delay: number;
  pulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all group ${
        pulse ? 'animate-pulse' : ''
      }`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{icon}</span>
          <span className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </motion.div>
  );
}

// Modern Item Card
function ItemCard({ 
  item, 
  index,
  onEdit, 
  onDelete 
}: { 
  item: Item; 
  index: number;
  onEdit: () => void; 
  onDelete: () => void;
}) {
  const typeConfig = {
    part: { icon: '⚙️', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
    component: { icon: '🔧', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
    assembly: { icon: '🏗️', color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50' },
  }[item.item_type];

  const isLowStock = item.track_inventory && item.available_stock <= item.min_stock_level;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all group"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Icon & Type */}
        <div className={`flex-shrink-0 w-16 h-16 rounded-xl ${typeConfig.bg} flex items-center justify-center text-3xl`}>
          {typeConfig.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-slate-900 truncate">{item.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${typeConfig.color}`}>
              {item.item_type}
            </span>
            {item.can_sell && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                💰 Sellable
              </span>
            )}
            {isLowStock && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                ⚠️ Low Stock
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mb-2">SKU: <span className="font-mono font-semibold">{item.sku}</span></p>
          {item.description && (
            <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
          )}
        </div>

        {/* Stock */}
        {item.track_inventory && (
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Current</p>
              <p className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>
                {item.current_stock}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Available</p>
              <p className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                {item.available_stock}
              </p>
            </div>
            {item.committed_stock > 0 && (
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Committed</p>
                <p className="text-2xl font-bold text-orange-600">{item.committed_stock}</p>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        {item.sell_price && (
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">Price</p>
            <p className="text-2xl font-bold text-indigo-600">${item.sell_price.toFixed(2)}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 font-semibold transition-all hover:scale-105 active:scale-95"
          >
            ✏️ Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-semibold transition-all hover:scale-105 active:scale-95"
          >
            🗑️
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Loading State with Skeletons
function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 animate-pulse">
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

// Empty State
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-16 text-center"
    >
      <div className="text-8xl mb-6">📭</div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        {hasFilters ? 'No items match your filters' : 'No items yet'}
      </h3>
      <p className="text-slate-600 mb-6">
        {hasFilters ? 'Try adjusting your filters' : 'Get started by adding your first item'}
      </p>
    </motion.div>
  );
}
