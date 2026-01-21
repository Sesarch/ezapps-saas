// types/items.ts
// TypeScript types for the Items system

export type ItemType = 'product' | 'component' | 'part' | 'assembly';

export interface Item {
  id: string;
  user_id: string;
  sku: string;
  name: string;
  description: string | null;
  item_type: ItemType;
  track_inventory: boolean;
  current_stock: number;
  committed_stock: number;
  available_stock: number;
  min_stock_level: number;
  can_sell: boolean;
  sell_price: number | null;
  cost_price: number | null;
  supplier_id: string | null;
  supplier_sku: string | null;
  unit: string;
  image_url: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateItemInput {
  sku: string;
  name: string;
  description?: string;
  item_type: ItemType;
  track_inventory?: boolean;
  current_stock?: number;
  min_stock_level?: number;
  can_sell?: boolean;
  sell_price?: number;
  cost_price?: number;
  supplier_id?: string;
  supplier_sku?: string;
  unit?: string;
  image_url?: string;
  notes?: string;
}

export interface UpdateItemInput extends Partial<CreateItemInput> {
  id: string;
}

export interface ItemsFilter {
  item_type?: ItemType;
  can_sell?: boolean;
  search?: string;
  low_stock?: boolean;
}

export interface ItemsStats {
  total: number;
  products: number;
  components: number;
  parts: number;
  assemblies: number;
  low_stock: number;
}
