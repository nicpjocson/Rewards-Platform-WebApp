import React, { createContext, useContext, ReactNode, useState, useCallback, use, useEffect } from 'react';
import { Product, Shop, ProductId, Code } from '../../../lib/types/Shop';
import { toast } from 'react-toastify';

interface ProductsContext {
  data: Shop[];
  setData: (data: Shop[]) => void;
  selectedProduct: ProductId | null;
  setSelectedProduct: (data: ProductId) => void;
  refresh: () => Promise<void>;
}
const productsContext = createContext<ProductsContext | undefined>(undefined);

export interface useShopsReturn {
  data: Shop[];
  createShop: (name: string) => Promise<void>;
  findShop: (name: string) => Shop | undefined;
  findShopi: (name: string) => number;
  updateShop: (name: string, newName: string) => Promise<void>;
  deleteShop: (name: string) => Promise<void>;
  refresh: () => Promise<void>;
}
export interface useProductsReturn {
	setSelectedProduct: (data: ProductId) => void;
	selectedProduct: ProductId | null;
	createProduct: (shop: string, p: Product) => Promise<void>;
	findProduct: (id: ProductId) => Product | undefined;
	findProducti: (id: ProductId) => [number, number];
	updateProduct: (id: ProductId, p: Product) => Promise<void>;
	deleteProduct: (id: ProductId) => Promise<void>;
}
export interface useCodeReturn {
  product: Product | undefined;
  productId: ProductId | null;
  createCode: (code: string, productId: ProductId) => Promise<void>;
  findCode: (code: string) => Code | undefined;
  findCodei: (code: string) => number;
  updateCode: (code: string, newCode: string, productId: ProductId) => Promise<void>;
  deleteCode: (code: string, productId: ProductId) => Promise<void>;
  deleteCodes: (codes: string[],productId: ProductId) => Promise<void>;
}


export function useShops(): useShopsReturn {
  const context = useContext(productsContext);
  if (context === undefined)
    throw new Error('useBrands must be used within a ProductsProviderProps');
  const { data, setData: updateData, refresh: _refresh } = context;

  const findShopi = useCallback((name: string) => {
	return data.findIndex(b => b.name === name);
  }, [data]);
  const findShop = useCallback((name: string) => {
	return data.find(b => b.name === name);
  }, [data]);

  const createShop = useCallback(async (name: string) => {
	const res = await fetch('/api/shop', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({ name }),
	});
	const json = await res.json()
	if (!res.ok) {
	  toast.error(json.error);
	  return 
	} else {
	  json.shop.products = [];
	  toast.success("Created brand: " + json.shop.name);
	  updateData([...data, json.shop]);
	}
  }, [data, updateData]);

  const updateShop = useCallback(async (name: string, newName: string) => {
	const res = await fetch('/api/shop/' + name, {
	  method: 'PATCH',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({ name: newName }),
	});
	const json = await res.json()
	if (!res.ok) {
	  toast.error(json.error);
	  return 
	} else {
	  const shop = findShop(name)!;
	  shop.name = json.shop.name;
	  toast.success("Edited brand: " + shop.name);
	  updateData([...data]);
	}
  }, [data, findShop, updateData]);

  const deleteShop = useCallback(async (name: string) => {
	const res = await fetch('/api/shop/' + name, {
	  method: 'DELETE',
	});
	const json = await res.json()
	if (!res.ok) {
	  toast.error(json.error);
	  return 
	} else {
	  toast.success("Deleted brand: " + name);
	  const i = findShopi(name);
	  data.splice(i, 1);
	  updateData([...data]);
	}
  }, [data, findShopi, updateData]);

  const refresh = useCallback(async () => {
	await _refresh();
	toast.info("Refreshed");
  }, [_refresh])

  return {
	data,
	createShop,
	findShop,
	findShopi,
	updateShop,
	deleteShop,
	refresh
  };
}
export function useProducts(): useProductsReturn {
  const context = useContext(productsContext);
  if (context === undefined)
	throw new Error('useProducts must be used within a ProductsProviderProps');
  const { 
	setSelectedProduct, data, setData: updateData, selectedProduct
  } = context;
  const { findShopi, findShop } = useShops();

  const findProducti = useCallback((id: ProductId): [number, number] => {
	const shopI = findShopi(id[0]);
	if (shopI === -1) return [-1, -1];
	return [shopI, data[shopI].products.findIndex(p => p.name === id[1])];
  }, [findShopi, data]);
  const findProduct = useCallback((id: ProductId) => {
	return findShop(id[0])?.products.find(p => p.name === id[1]);
  }, [findShop]);

  const createProduct = useCallback(async (shopName: string, p: Product) => {
	const res = await fetch('/api/shop/' + shopName + '/product', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(p),
	});
	const json = await res.json()
	if (!res.ok) {
	  toast.error(json.error);
	  return 
	} else {
		const prod = json.product as Product;
		const shop = findShop(prod.shopName)!;
		shop.products.push(prod);
		toast.success("Created product: " + prod.name);
	}
  }, [findShop]);

  const updateProduct = useCallback(async (id: ProductId, p: Product) => {
	const res = await fetch('/api/shop/' + id[0] + '/product/' + id[1], {
	  method: 'PATCH',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(p),
	});
	const json = await res.json()
	if (!res.ok) {
	  toast.error(json.error);
	  return 
	} else {
		const prod = json.product as Product;
		const [shopI, prodI] = findProducti(id);
		data[shopI].products[prodI] = prod;
		toast.success("Edited product: " + prod.name);
		updateData([...data]);
	}
  }, [data, findProducti, updateData]);

  const deleteProduct = useCallback(async (id: ProductId) => {
	const res = await fetch('/api/shop/' + id[0] + '/product/' + id[1], {
	  method: 'DELETE',
	});
	const json = await res.json()
	if (!res.ok) {
	  toast.error(json.error);
	  return
	} else {
		const [shopI, prodI] = findProducti(id);
		const shop = data[shopI];
		const prod = shop.products[prodI];
		shop.products.splice(prodI, 1);
		toast.success("Deleted product: " + prod.name);
		updateData([...data]);
	}
  }, [data, findProducti, updateData]);
  return {
	setSelectedProduct,
	selectedProduct,
	createProduct,
	findProduct,
	findProducti,
	updateProduct,
	deleteProduct,
  };
}

export function useCode(): useCodeReturn {
	const context = useContext(productsContext);
	if (context === undefined)
	  throw new Error('useSelectedProduct must be used within a ProductsProviderProps');
	const { selectedProduct: productId, data, setData: updateData } = context;
	const { findProduct } = useProducts();
	const product = productId ? findProduct(productId) : undefined;

	const findCode = useCallback((code: string) => {
		return product?.codes.find(c => c.code === code);
	}, [product]);
	const findCodei = useCallback((code: string) => {
		return product?.codes.findIndex(c => c.code === code) ?? -1;
	}, [product]);

	const createCode = useCallback(async (code: string, productId: ProductId) => {
		const res = await fetch('/api/shop/' + productId[0] + '/code', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code, productName: productId[1] }),
		});
		const json = await res.json()
		console.log(json)
		if (!res.ok) {
			toast.error(json.error);
			return 
		} else {
			const code = json.code as Code;
			findProduct(productId)!.codes.push(code);
			toast.success("Created code: " + code.code);
			updateData([...data]);
		}
	}, [data, findProduct, updateData]);

	const updateCode = useCallback(async (code: string, newCode: string, productId: ProductId) => {
		const res = await fetch('/api/shop/' + productId[0] + '/code/' + code, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code: newCode }),
		});
		const json = await res.json()
		if (!res.ok) {
			toast.error(json.error);
			return 
		} else {
			const newCode = json.code as Code;
			const i = findCodei(code);
			findProduct(productId)!.codes[i] = newCode;
			toast.success("Edited code: " + newCode.code);
			updateData([...data]);
		}
	}, [data, findCodei, findProduct, updateData]);

	const deleteCode = useCallback(async (code: string, productId: ProductId) => {
		const res = await fetch('/api/shop/' + productId[0] + '/code/' + code, {
			method: 'DELETE',
		});
		const json = await res.json()
		if (!res.ok) {
			toast.error(json.error);
			return 
		} else {
			const i = findCodei(code);
			findProduct(productId)!.codes.splice(i, 1);
			toast.success("Deleted code: " + code);
			updateData([...data]);
		}
	}, [data, findCodei, findProduct, updateData]);

	const deleteCodes = useCallback(async (codes: string[], productId: ProductId) => {
		const res = await fetch('/api/shop/' + productId[0] + '/code', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ codes }),
		});
		const json = await res.json()
		if (!res.ok) {
			toast.error(json.error);
			return 
		} else {
			const product = findProduct(productId)!;
			const newCodes = product.codes.filter(c => !codes.includes(c.code));
			product.codes = newCodes;
			toast.success("Deleted codes: " + codes.join(', '));
			updateData([...data]);
		}
	}, [data, findProduct, updateData]);

	return {
		product,
		productId,
		createCode,
		findCode,
		findCodei,
		updateCode,
		deleteCode,
		deleteCodes,
	};
};

interface ProductsProviderProps {
  children: ReactNode;
}
export function ProductsProvider({ children }: ProductsProviderProps) {
  const [brands, setData] = useState<Shop[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductId | null>(null);
  const refresh = useCallback(async () => {
	const res = await fetch('/api/shop?full=true')
	if (res.status !== 200) {
	  console.error(res);
	  return;
	}
	const data = await res.json();
	setData(data.shops);
  }, []);
  useEffect(() => {
	refresh();
  }, [refresh]);

  const contextValue: ProductsContext = {
    data: brands,
	selectedProduct,
    setData,
	setSelectedProduct,
	refresh,
  };
  return <productsContext.Provider value={contextValue}>{children}</productsContext.Provider>;
}
