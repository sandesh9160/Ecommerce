import { Product, CartItem } from './api';

const CART_STORAGE_KEY = 'yuvakart_cart';

export class CartService {
    // Get all cart items
    static getCart(): CartItem[] {
        if (typeof window === 'undefined') return [];
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
            try {
                return JSON.parse(cartData);
            } catch {
                return [];
            }
        }
        return [];
    }

    // Add item to cart
    static addToCart(product: Product, quantity: number = 1): CartItem[] {
        const cart = this.getCart();
        const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

        if (existingItemIndex > -1) {
            // Update quantity if product already in cart
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.push({ product, quantity });
        }

        this.saveCart(cart);
        return cart;
    }

    // Update cart item quantity
    static updateQuantity(productId: number, quantity: number): CartItem[] {
        const cart = this.getCart();
        const itemIndex = cart.findIndex(item => item.product.id === productId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = quantity;
            }
        }

        this.saveCart(cart);
        return cart;
    }

    // Remove item from cart
    static removeFromCart(productId: number): CartItem[] {
        let cart = this.getCart();
        cart = cart.filter(item => item.product.id !== productId);
        this.saveCart(cart);
        return cart;
    }

    // Clear all cart items
    static clearCart(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    }

    // Get cart total
    static getCartTotal(): number {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    // Get cart item count
    static getCartItemCount(): number {
        const cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Private method to save cart to localStorage
    private static saveCart(cart: CartItem[]): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        }
    }

    // Check if product is in cart
    static isInCart(productId: number): boolean {
        const cart = this.getCart();
        return cart.some(item => item.product.id === productId);
    }

    // Get cart item by product ID
    static getCartItem(productId: number): CartItem | undefined {
        const cart = this.getCart();
        return cart.find(item => item.product.id === productId);
    }
}
