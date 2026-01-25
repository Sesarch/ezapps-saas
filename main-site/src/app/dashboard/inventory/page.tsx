'use client';

import { useAuth } from '@/components/AuthProvider';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import NoStoreConnected from '@/components/NoStoreConnected';

export default function InventoryPage() {
  const { user } = useAuth();
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch user's stores
  useEffect(() => {
    if (user) {
      fetchStores();
    }
  }, [user]);

  const fetchStores = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      // Get all active stores (not just Shopify)
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)  // ✅ FIXED: Use is_active instead of status
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Store fetch error:', error);
        setLoading(false);
        return;
      }

      setStores(data || []);
      if (data && data.length > 0) {
        setSelectedStore(data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setLoading(false);
    }
  };

  // Fetch products when store is selected
  useEffect(() => {
    if (selectedStore) {
      fetchProducts();
    }
  }, [selectedStore]);

  const fetchProducts = async () => {
    if (!selectedStore) return;
    
    setLoadingProducts(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/shopify/products?storeId=${selectedStore.id}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setProducts([]);
      } else {
        setProducts(data.products || []);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Failed to fetch products from Shopify');
      setProducts([]);
    }
    
    setLoadingProducts(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // No stores connected - show beautiful popup
  if (stores.length === 0) {
    return (
      <NoStoreConnected
        pageTitle="What is Inventory Management"
        pageIcon="📦"
        description="Connect a store to view and manage your product inventory."
        features={[
          'View all products from your store',
          'Track inventory levels in real-time',
          'Monitor stock status (in stock, low stock, out of stock)',
          'Sync product data from your platform'
        ]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-indigo-600 mb-3">Inventory Management</h1>
            <p className="text-slate-600 text-lg">
              {selectedStore ? `Products from ${selectedStore.store_name}` : 'Manage your product inventory'}
            </p>
          </div>
          
          {/* Store Selector */}
          {stores.length > 1 && (
            <select
              value={selectedStore?.id || ''}
              onChange={(e) => {
                const store = stores.find(s => s.id === e.target.value);
                setSelectedStore(store);
              }}
              className="mt-4 sm:mt-0 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.store_name} ({store.store_url})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-indigo-600">{products.length}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Stock</p>
                <p className="text-3xl font-bold text-green-600">
                  {products.filter(p => p.variants?.[0]?.inventory_quantity > 0).length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">
                  {products.filter(p => p.variants?.[0]?.inventory_quantity <= 0).length}
                </p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 px-6 py-4 bg-red-50 text-red-700 border-2 border-red-200 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Products</h2>
            <button
              onClick={fetchProducts}
              disabled={loadingProducts}
              className="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors disabled:opacity-50 font-semibold"
            >
              {loadingProducts ? '⏳ Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

          {loadingProducts ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Inventory</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    const variant = product.variants?.[0];
                    const inventory = variant?.inventory_quantity || 0;
                    return (
                      <tr key={product.id} className="hover:bg-indigo-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.image?.src ? (
                              <img 
                                src={product.image.src} 
                                alt={product.title} 
                                className="w-12 h-12 object-cover rounded-lg border-2 border-gray-100" 
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                📷
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{product.title}</p>
                              <p className="text-sm text-gray-500">{product.vendor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {variant?.sku || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          ${variant?.price || '0.00'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-lg font-bold ${
                            inventory > 10 ? 'text-green-600' : 
                            inventory > 0 ? 'text-amber-600' : 
                            'text-red-600'
                          }`}>
                            {inventory}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {inventory > 10 ? (
                            <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                              ✅ In Stock
                            </span>
                          ) : inventory > 0 ? (
                            <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
                              ⚠️ Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                              ❌ Out of Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">No Products Found</h3>
              <p className="text-gray-600">
                {error ? 'There was an error fetching products.' : 'No products found in this store'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
