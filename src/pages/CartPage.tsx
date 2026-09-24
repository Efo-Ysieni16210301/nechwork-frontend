import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  if (!items.length) {
    return <main className="cart-page empty-cart"><p className="eyebrow">Your bag</p><h1>Your bag is waiting.</h1><p>Add something good to get started.</p><Link className="btn btn-primary" to="/shop">Shop all products</Link></main>;
  }
  return (
    <main className="cart-page">
      <p className="eyebrow">Your bag</p><h1>Ready when you are.</h1>
      <div className="cart-layout">
        <section className="cart-items">
          {items.map(({ product, quantity }) => (
            <div className="cart-item" key={product.id}>
              <img src={product.image} alt="" />
              <div><span className="product-category">{product.category}</span><h2>{product.name}</h2><button className="remove-button" onClick={() => removeFromCart(product.id)}>Remove</button></div>
              <div className="quantity-control"><button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label={`Decrease ${product.name}`}>−</button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label={`Increase ${product.name}`}>+</button></div>
              <strong>${(product.price * quantity).toFixed(2)}</strong>
            </div>
          ))}
        </section>
        <aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><div><span>Shipping</span><span>Calculated at checkout</span></div><button className="btn btn-primary" onClick={() => navigate("/checkout")}>Continue to checkout</button><Link to="/shop" className="continue-shopping">← Continue shopping</Link></aside>
      </div>
    </main>
  );
}
