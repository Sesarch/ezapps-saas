'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Store {
  id: string;
  store_name: string;
  store_url: string;
  platform_id: string;
  status?: string;
}

interface Product {
  id: number;
  title: string;
  handle: string;
  image?: string;
  variants?: any[];
}

interface BOMItem {
  id: string;
  shopify_product_id: string;
  item_id: string;
  quantity: number;
  items?: {
    name: string;
    sku: string;
    current_stock: number;
    unit?: string;
  };
}

export default function BOMBuilderPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [bomData, setBomData] = useState<Record<string, BOMItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadStoresAndData();
  }, []);

  const loadStoresAndData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Load active stores
      const { data: storesData } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'disconnected')
        .order('created_at', { ascending: true });

      if (storesData && storesData.length > 0) {
        setStores(storesData);
        const firstStore = storesData[0];
        setCurrentStore(firstStore);
        await loadStoreData(firstStore);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStoreData = async (store: Store) => {
    try {
      // Load products from Shopify API
      const response = await fetch(`/api/shopify/products?storeId=${store.id}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }

      // Load BOM data from database
      const { data: bomItems } = await supabase
        .from('bom_items')
        .select('*, items(name, sku, current_stock, unit)')
        .eq('store_id', store.id);

      if (bomItems) {
        const grouped = bomItems.reduce((acc: Record<string, BOMItem[]>, item) => {
          const productId = String(item.shopify_product_id);
          if (!acc[productId]) acc[productId] = [];
          acc[productId].push(item);
          return acc;
        }, {});
        setBomData(grouped);
      }
    } catch (error) {
      console.error('Error loading store data:', error);
    }
  };

  const handleStoreChange = async (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setCurrentStore(store);
      setIsLoading(true);
      await loadStoreData(store);
      setIsLoading(false);
    }
  };

  const extractId = (id: string | number): string => {
    if (typeof id === 'number') return String(id);
    if (typeof id === 'string' && id.includes('gid://')) {
      return id.split('/').pop() || id;
    }
    return String(id);
  };

  const calculateBuildQuantity = (productId: string): number => {
    const bom = bomData[productId];
    if (!bom || bom.length === 0) return 0;

    return Math.min(
      ...bom.map(item => {
        const stock = item.items?.current_stock || 0;
        return Math.floor(stock / item.quantity);
      })
    );
  };

  const findBottleneck = (productId: string): BOMItem | null => {
    const bom = bomData[productId];
    if (!bom || bom.length === 0) return null;

    let minBuilds = Infinity;
    let bottleneckItem: BOMItem | null = null;

    bom.forEach(item => {
      const stock = item.items?.current_stock || 0;
      const possibleBuilds = Math.floor(stock / item.quantity);
      if (possibleBuilds < minBuilds) {
        minBuilds = possibleBuilds;
        bottleneckItem = item;
      }
    });

    return bottleneckItem;
  };

  const productsWithBOM = products.filter(p => bomData[extractId(p.id)]?.length > 0);
  const productsNeedingBOM = products.filter(p => !bomData[extractId(p.id)] || bomData[extractId(p.id)].length === 0);

  // No stores connected
  if (!isLoading && stores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-indigo-100">
            <div className="text-8xl mb-6">🏗️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Store Connected
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect a store to start building Bills of Materials for your products.
            </p>
            
            <div className="bg-indigo-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-indigo-900 mb-3">🏗️ What is BOM Builder?</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Create Bills of Materials for each product</li>
                <li>✓ Define which items are needed to build products</li>
                <li>✓ Track how many products you can build</li>
                <li>✓ Identify inventory bottlenecks</li>
              </ul>
            </div>

            <Link
              href="/dashboard/stores"
              className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105"
            >
              🚀 Connect Your First Store
            </Link>

            <p className="text-sm text-gray-500 mt-6">
              Workflow: Connect Store → Sync Products → Add Items → Build BOMs
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-3">BOM Builder</h1>
          <p className="text-slate-600 text-lg">
            {currentStore ? `Build Bills of Materials for ${currentStore.store_name}` : 'Build Bills of Materials'}
          </p>
        </div>

        {/* Store Selector */}
        {stores.length > 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📱 Current Store:
            </label>
            <select
              value={currentStore?.id || ''}
              onChange={(e) => handleStoreChange(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.store_name} ({store.store_url})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-gray-600 text-sm">With BOM</p>
                <p className="text-3xl font-bold text-green-600">{productsWithBOM.length}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Need BOM</p>
                <p className="text-3xl font-bold text-orange-600">{productsNeedingBOM.length}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total BOM Entries</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Object.values(bomData).flat().length}
                </p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Products with BOM */}
            {productsWithBOM.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ✅ Products with BOM ({productsWithBOM.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {productsWithBOM.map(product => {
                    const productId = extractId(product.id);
                    const bom = bomData[productId] || [];
                    const buildQty = calculateBuildQuantity(productId);
                    const bottleneck = findBottleneck(productId);

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-green-100"
                      >
                        <div className="flex gap-4 mb-4">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                              {product.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {bom.length} item{bom.length !== 1 ? 's' : ''} in BOM
                            </p>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Can Build:</span>
                            <span className="text-2xl font-bold text-green-600">
                              {buildQty}
                            </span>
                          </div>
                        </div>

                        {bottleneck && (
                          <div className="bg-orange-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-orange-800 mb-1">
                              🔴 Bottleneck:
                            </p>
                            <p className="text-sm text-orange-700">
                              {bottleneck.items?.name} ({bottleneck.items?.current_stock || 0} {bottleneck.items?.unit || 'pcs'})
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Products needing BOM */}
            {productsNeedingBOM.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ⚠️ Products Needing BOM ({productsNeedingBOM.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {productsNeedingBOM.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-orange-100"
                    >
                      <div className="flex gap-4">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-2">
                            {product.title}
                          </h3>
                          <p className="text-sm text-orange-600 font-medium">
                            No BOM configured
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
