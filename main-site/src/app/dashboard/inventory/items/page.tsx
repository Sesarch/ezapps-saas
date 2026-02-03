'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Item {
  id: string;
  name: string;
  sku: string;
  description?: string;
  item_type: string;
  unit?: string;
  current_stock: number;
  min_stock: number;
  store_id: string;
  image_url?: string;
  created_at?: string;
}

interface Store {
  id: string;
  store_name: string;
  store_url: string;
  platform_id: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    loadStoresAndItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, searchTerm]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const loadStoresAndItems = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (storesError) throw storesError;

      setAllStores(storesData || []);

      if (storesData && storesData.length > 0) {
        const firstStore = storesData[0];
        setCurrentStore(firstStore);
        await loadItemsForStore(firstStore.id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadItemsForStore = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
      showToast('Failed to load items', 'error');
    }
  };

  const handleStoreChange = async (storeId: string) => {
    const store = allStores.find(s => s.id === storeId);
    if (store) {
      setCurrentStore(store);
      setIsLoading(true);
      await loadItemsForStore(storeId);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.sku.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        (item.description && item.description.toLowerCase().includes(search))
      );
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) throw error;
      
      if (currentStore) {
        await loadItemsForStore(currentStore.id);
      }
      showToast('Item deleted successfully', 'success');
    } catch (error: any) {
      showToast(`Failed to delete: ${error.message}`, 'error');
    }
  };

  if (!isLoading && allStores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-indigo-100"
          >
            <div className="text-8xl mb-6">🏪</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Store Connected
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect a store to start managing your inventory items.
            </p>
            
            <div className="bg-indigo-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-indigo-900 mb-3">📦 What are Items?</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Internal inventory (parts, components, materials)</li>
                <li>✓ Used to build your products (BOMs)</li>
                <li>✓ Track stock levels and costs</li>
                <li>✓ Each store has its own items</li>
              </ul>
            </div>

            <Link
              href="/dashboard/stores"
              className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105"
            >
              🚀 Connect Your First Store
            </Link>

            <p className="text-sm text-gray-500 mt-6">
              Supports: Shopify • WooCommerce • Wix • and more
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-3">Items Management</h1>
          <p className="text-slate-600 text-lg">
            {currentStore ? `Inventory for ${currentStore.store_name}` : 'Internal inventory'}
          </p>
        </div>

        {allStores.length > 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📱 Current Store:
            </label>
            <select
              value={currentStore?.id || ''}
              onChange={(e) => handleStoreChange(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
            >
              {allStores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.store_name} ({store.store_url})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <button
              onClick={() => setShowAddModal(true)}
              disabled={!currentStore}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Add Item
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold mb-2">No items yet</h3>
            <p className="text-slate-600">Add your first item to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Item Image */}
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center border-2 border-indigo-200">
                        <span className="text-3xl">📦</span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {item.item_type}
                        </span>
                        {item.unit && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {item.unit}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">SKU: {item.sku}</p>
                      {item.description && <p className="text-sm text-slate-500 mt-1">{item.description}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-500">Stock</p>
                      <p className="text-2xl font-bold">{item.current_stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 font-semibold"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-semibold"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(showAddModal || editingItem) && currentStore && (
          <ItemForm
            storeId={currentStore.id}
            onClose={() => {
              setShowAddModal(false);
              setEditingItem(null);
            }}
            onSuccess={() => {
              loadItemsForStore(currentStore.id);
              setShowAddModal(false);
              setEditingItem(null);
              showToast(editingItem ? 'Item updated' : 'Item created', 'success');
            }}
            editItem={editingItem}
          />
        )}

        {toast && (
          <div className="fixed bottom-8 right-8 z-50">
            <div className={`px-6 py-4 rounded-xl shadow-2xl ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{toast.type === 'success' ? '✓' : '✕'}</span>
                <span className="font-semibold">{toast.message}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ItemForm({ storeId, onClose, onSuccess, editItem }: any) {
  const [formData, setFormData] = useState({
    item_type: editItem?.item_type || 'part',
    unit: editItem?.unit || 'pcs',
    name: editItem?.name || '',
    sku: editItem?.sku || '',
    description: editItem?.description || '',
    current_stock: editItem?.current_stock || 0,
    min_stock: editItem?.min_stock || 0,
    image_url: editItem?.image_url || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editItem?.image_url || '');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const units = [
    { category: '📦 Quantity', options: [
      { value: 'pcs', label: 'pcs (pieces)' },
      { value: 'box', label: 'box (boxes)' },
      { value: 'pack', label: 'pack (packs)' },
      { value: 'set', label: 'set (sets)' },
      { value: 'pair', label: 'pair (pairs)' },
      { value: 'dozen', label: 'dozen' },
      { value: 'roll', label: 'roll (rolls)' },
      { value: 'sheet', label: 'sheet (sheets)' },
    ]},
    { category: '⚖️ Weight', options: [
      { value: 'kg', label: 'kg (kilograms)' },
      { value: 'g', label: 'g (grams)' },
      { value: 'mg', label: 'mg (milligrams)' },
      { value: 'lb', label: 'lb (pounds)' },
      { value: 'oz', label: 'oz (ounces)' },
    ]},
    { category: '📏 Length', options: [
      { value: 'm', label: 'm (meters)' },
      { value: 'cm', label: 'cm (centimeters)' },
      { value: 'mm', label: 'mm (millimeters)' },
      { value: 'ft', label: 'ft (feet)' },
      { value: 'in', label: 'in (inches)' },
    ]},
    { category: '🧪 Volume', options: [
      { value: 'L', label: 'L (liters)' },
      { value: 'mL', label: 'mL (milliliters)' },
      { value: 'gal', label: 'gal (gallons)' },
      { value: 'qt', label: 'qt (quarts)' },
    ]},
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    setUploadingImage(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${storeId}/${Date.now()}.${fileExt}`;

      console.log('📤 Uploading image:', fileName);

      const { error: uploadError, data } = await supabase.storage
        .from('part-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ Upload success:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('part-images')
        .getPublicUrl(fileName);

      console.log('🔗 Public URL:', publicUrl);

      return publicUrl;
    } catch (err: any) {
      console.error('💥 Image upload error:', err);
      setError(`Failed to upload image: ${err.message}`);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload image if new file selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const itemData = {
        ...formData,
        image_url: imageUrl,
        user_id: user.id,
        store_id: storeId,
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
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">{editItem ? '✏️ Edit Item' : '✨ Create New Item'}</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-200 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-lg font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Image Upload Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-100">
            <h3 className="text-lg font-bold text-purple-900 mb-4">📸 Item Image</h3>
            
            <div className="flex items-center gap-6">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-xl border-2 border-purple-200"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center border-2 border-purple-200">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="block">
                  <span className="sr-only">Choose image</span>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF up to 5MB
                </p>
                {imageFile && (
                  <p className="text-sm text-purple-600 mt-2">
                    ✓ {imageFile.name} selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">📋 Categorization</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-indigo-900 mb-2">
                  Item Type *
                </label>
                <select
                  value={formData.item_type}
                  onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium"
                >
                  <option value="part">⚙️ Part</option>
                  <option value="component">🔧 Component</option>
                  <option value="assembly">📦 Assembly</option>
                  <option value="box">📦 Box</option>
                  <option value="label">🏷️ Label</option>
                  <option value="packaging">📦 Packaging</option>
                  <option value="tool">🔨 Tool</option>
                  <option value="material">🧱 Material</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-indigo-900 mb-2">
                  Unit of Measure *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium"
                >
                  {units.map(category => (
                    <optgroup key={category.category} label={category.category}>
                      {category.options.map(unit => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Steel Bolt M8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU / Part Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., BOLT-M8-001"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional description or notes..."
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Stock Management</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock Level
                </label>
                <input
                  type="number"
                  value={formData.current_stock}
                  onChange={(e) => setFormData({ ...formData, current_stock: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stock Level
                </label>
                <input
                  type="number"
                  value={formData.min_stock}
                  onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading || uploadingImage ? '⏳ Saving...' : editItem ? '💾 Update Item' : '✨ Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
