async function recalculateCommitted(storeId: string) {
  try {
    const { data: unfulfilledOrders } = await supabase
      .from('shopify_orders')
      .select('id')
      .eq('store_id', storeId)
      .or('fulfillment_status.is.null,fulfillment_status.eq.unfulfilled,fulfillment_status.eq.partial')

    console.log('Unfulfilled orders:', unfulfilledOrders?.length || 0)

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

    console.log('Line items found:', lineItems?.length || 0)
    console.log('Line items:', JSON.stringify(lineItems, null, 2))

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

    console.log('BOM items found:', bomItems?.length || 0)
    console.log('BOM items:', JSON.stringify(bomItems, null, 2))

    if (!bomItems || bomItems.length === 0) {
      await supabase
        .from('parts')
        .update({ committed: 0 })
        .eq('store_id', storeId)
      return
    }

    const partCommitted: Record<string, number> = {}

    for (const lineItem of lineItems) {
      console.log(`Checking lineItem: product=${lineItem.shopify_product_id}, variant=${lineItem.shopify_variant_id}`)
      
      const matchingBom = bomItems.filter(bom => {
        const productMatch = String(bom.shopify_product_id) === String(lineItem.shopify_product_id)
        const variantMatch = String(bom.shopify_variant_id) === String(lineItem.shopify_variant_id)
        console.log(`  BOM: product=${bom.shopify_product_id}, variant=${bom.shopify_variant_id} | productMatch=${productMatch}, variantMatch=${variantMatch}`)
        return productMatch && variantMatch
      })

      console.log(`  Matches found: ${matchingBom.length}`)

      for (const bom of matchingBom) {
        const committed = lineItem.quantity * bom.quantity_needed
        partCommitted[bom.part_id] = (partCommitted[bom.part_id] || 0) + committed
        console.log(`  Adding ${committed} to part ${bom.part_id}`)
      }
    }

    await supabase
      .from('parts')
      .update({ committed: 0 })
      .eq('store_id', storeId)

    for (const [partId, committed] of Object.entries(partCommitted)) {
      await supabase
        .from('parts')
        .update({ committed })
        .eq('id', partId)
    }

    console.log('Final committed values:', partCommitted)
  } catch (error) {
    console.error('Error recalculating committed:', error)
  }
}
