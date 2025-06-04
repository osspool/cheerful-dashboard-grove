
export const getDisplaySize = (variant: any) => {
  if (variant.stockx?.variantValue) {
    return variant.stockx.variantValue;
  }
  if (variant.goat?.size) {
    return `${variant.goat.size}${variant.goat.size_unit === 'SIZE_UNIT_US' ? ' US' : ''}`;
  }
  return 'N/A';
};

export const formatToastMessage = (inventory: any, operationMode: 'receiving' | 'shipping') => {
  return `Item Scanned: ${inventory.product.title} - Size ${getDisplaySize(inventory.variant)} (${operationMode} mode)`;
};
