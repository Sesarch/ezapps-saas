async function recalculateCommitted(storeId: string) {
  try {
    const { data: unfulfilledOrders } = await supabase
      .from('shopify_orders')
      .select('id')
      .eq('store_id', storeId)
      .or('fulfillment_status.is.null,fulfillment_status.eq.unfulfilled,fulfillment_status.eq.partial')

    if (!unfulfilledOrders || unfulfilledOrders.length === 0) {
      await supabase
        .from('parts')
        .update({ committed: 0 })
        .eq('store_id', storeId)
      return
    }

    const orderIds = unfulfilledOrders.map(o => o.id)

    const { data: lineItems } = await supabase
      .from('order_line_items')
      .select('shopify_product_id, shopify_variant_id, quantity')
      .in('order_id', orderIds)

    if (!lineItems || lineItems.length === 0) {
      await supabase
        .from('parts')
        .update({ committed: 0 })
        .eq('store_id', storeId)
      return
    }

    const { data: bomItems } = await supabase
      .from('bom_items')
      .select('shopify_product_id, shopify_variant_id, part_id, quantity_needed')
      .eq('store_id', storeId)

    if (!bomItems || bomItems.length === 0) {
      await supabase
        .from('parts')
        .update({ committed: 0 })
        .eq('store_id', storeId)
      return
    }

    const partCommitted: Record<string, number> = {}

    for (const lineItem of lineItems) {
      // FIX: Convert to strings for reliable comparison
      const matchingBom = bomItems.filter(bom => 
        String(bom.shopify_product_id) === String(lineItem.shopify_product_id) &&
        String(bom.shopify_variant_id) === String(lineItem.shopify_variant_id)
      )

      for (const bom of matchingBom) {
        const committed = lineItem.quantity * bom.quantity_needed
        partCommitted[bom.part_id] = (partCommitted[bom.part_id] || 0) + committed
      }
    }

    // Reset all parts to 0
    await supabase
      .from('parts')
      .update({ committed: 0 })
      .eq('store_id', storeId)

    // Update each part with calculated committed
    for (const [partId, committed] of Object.entries(partCommitted)) {
      await supabase
        .from('parts')
        .update({ committed })
        .eq('id', partId)
    }

    console.log('Committed inventory recalculated:', partCommitted)
  } catch (error) {
    console.error('Error recalculating committed:', error)
  }
}
