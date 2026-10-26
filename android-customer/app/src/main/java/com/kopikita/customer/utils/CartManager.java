package com.kopikita.customer.utils;

import com.kopikita.customer.model.CartItem;
import java.util.ArrayList;
import java.util.List;

public class CartManager {
    private static CartManager instance;

    private final List<CartItem> cartItems = new ArrayList<>();
    private String promoCode = "";
    private int discountAmount = 0;
    private String orderType = "dine_in"; // "dine_in" or "take_away"
    private String customerName = "";
    private String tableNumber = "";

    public interface OnCartChangeListener {
        void onCartChanged();
    }

    private final List<OnCartChangeListener> listeners = new ArrayList<>();

    private CartManager() {
    }

    public static synchronized CartManager getInstance() {
        if (instance == null) {
            instance = new CartManager();
        }
        return instance;
    }

    public void addListener(OnCartChangeListener listener) {
        if (!listeners.contains(listener)) {
            listeners.add(listener);
        }
    }

    public void removeListener(OnCartChangeListener listener) {
        listeners.remove(listener);
    }

    private void notifyListeners() {
        for (OnCartChangeListener l : listeners) {
            if (l != null) l.onCartChanged();
        }
    }

    public List<CartItem> getCartItems() {
        return new ArrayList<>(cartItems);
    }

    public void addItem(CartItem item) {
        for (CartItem existing : cartItems) {
            if (existing.getId().equals(item.getId())) {
                existing.setQuantity(existing.getQuantity() + item.getQuantity());
                recalculateDiscount();
                notifyListeners();
                return;
            }
        }
        cartItems.add(item);
        recalculateDiscount();
        notifyListeners();
    }

    public void updateQuantity(String itemId, int delta) {
        for (int i = 0; i < cartItems.size(); i++) {
            CartItem it = cartItems.get(i);
            if (it.getId().equals(itemId)) {
                int nextQty = it.getQuantity() + delta;
                if (nextQty <= 0) {
                    cartItems.remove(i);
                } else {
                    it.setQuantity(nextQty);
                }
                break;
            }
        }
        recalculateDiscount();
        notifyListeners();
    }

    public void removeItem(String itemId) {
        for (int i = 0; i < cartItems.size(); i++) {
            if (cartItems.get(i).getId().equals(itemId)) {
                cartItems.remove(i);
                break;
            }
        }
        recalculateDiscount();
        notifyListeners();
    }

    public void clear() {
        cartItems.clear();
        promoCode = "";
        discountAmount = 0;
        notifyListeners();
    }

    public int getTotalItems() {
        int count = 0;
        for (CartItem it : cartItems) {
            count += it.getQuantity();
        }
        return count;
    }

    public int getSubtotal() {
        int sum = 0;
        for (CartItem it : cartItems) {
            sum += it.getTotalPrice();
        }
        return sum;
    }

    public boolean applyPromo(String code) {
        if (code == null) return false;
        String clean = code.trim().toUpperCase();
        if (Constants.PROMO_SENJA30.equalsIgnoreCase(clean)) {
            promoCode = clean;
            recalculateDiscount();
            notifyListeners();
            return true;
        } else if (Constants.PROMO_KOPIKITA5K.equalsIgnoreCase(clean)) {
            promoCode = clean;
            recalculateDiscount();
            notifyListeners();
            return true;
        }
        return false;
    }

    public void removePromo() {
        promoCode = "";
        discountAmount = 0;
        notifyListeners();
    }

    private void recalculateDiscount() {
        int sub = getSubtotal();
        if (Constants.PROMO_SENJA30.equalsIgnoreCase(promoCode)) {
            discountAmount = (int) Math.round(sub * 0.30);
        } else if (Constants.PROMO_KOPIKITA5K.equalsIgnoreCase(promoCode)) {
            discountAmount = Math.min(5000, sub);
        } else {
            discountAmount = 0;
        }
    }

    public int getDiscount() {
        return discountAmount;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public int getTotalAmount() {
        return Math.max(0, getSubtotal() - discountAmount);
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }
}
