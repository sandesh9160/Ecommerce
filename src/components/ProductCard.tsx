'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/api';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Safe image URL construction with error handling
  const getImageSrc = () => {
    try {
      if (!product.image) return '/placeholder-product.svg';

      if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
        return product.image;
      }

      const baseUrl = 'http://localhost:8000';
      const imagePath = product.image.startsWith('/') ? product.image : '/' + product.image;
      return baseUrl + imagePath;
    } catch (error) {
      console.error('Error constructing image URL:', error);
      return '/placeholder-product.svg';
    }
  };

  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={getImageSrc()}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
          />
          {(!product.is_in_stock && product.stock === 0) && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-lg">
              <span className="text-white font-medium text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-green-600">
              ₹{product.price}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.category_name}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!product.is_in_stock}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </Link>
    </div>
  );
}
