export async function getCategories() {
  const ENDPOINT = 'https://api.mercadolibre.com/sites/MLB/categories';
  const response = await fetch(ENDPOINT);
  const data = await response.json();
  return data;
}

export async function getProductsFromCategoryAndQuery(categoryId, query) {
  const ENDPOINT_01 = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}`;
  const ENDPOINT_02 = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  if (categoryId !== undefined) {
    const response = await fetch(ENDPOINT_01);
    const data = await response.json();
    return data;
  } 
  if (query !== undefined) {
    const response = await fetch(ENDPOINT_02);
    const data = await response.json();
    return data;
  }
  else {
    
  }

}

export async function getProductById() {
  // Esta implementação específica não é avaliada, mas pode ajudar você 🙂
  // Atenção: essa função não deverá ser chamada na tela do carrinho de compras.
}
