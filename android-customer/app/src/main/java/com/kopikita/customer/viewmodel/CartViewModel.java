package com.kopikita.customer.viewmodel;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.kopikita.customer.model.CartItem;
import com.kopikita.customer.model.Order;
import com.kopikita.customer.repository.CoffeeRepository;
import com.kopikita.customer.utils.CartManager;
import java.util.List;

public class CartViewModel extends AndroidViewModel {
    private final CoffeeRepository repository;
    private final CartManager cartManager;

    private final MutableLiveData<List<CartItem>> cartItemsLiveData = new MutableLiveData<>();
    private final MutableLiveData<Integer> subtotalLiveData = new MutableLiveData<>(0);
    private final MutableLiveData<Integer> discountLiveData = new MutableLiveData<>(0);
    private final MutableLiveData<Integer> totalLiveData = new MutableLiveData<>(0);
    private final MutableLiveData<String> promoCodeLiveData = new MutableLiveData<>("");
    private final MutableLiveData<Boolean> isSubmittingLiveData = new MutableLiveData<>(false);
    private final MutableLiveData<Order> orderSuccessLiveData = new MutableLiveData<>();
    private final MutableLiveData<String> orderErrorLiveData = new MutableLiveData<>();

    public CartViewModel(@NonNull Application application) {
        super(application);
        this.repository = new CoffeeRepository(application);
        this.cartManager = CartManager.getInstance();

        cartManager.addListener(this::refreshCart);
        refreshCart();
    }

    public LiveData<List<CartItem>> getCartItems() {
        return cartItemsLiveData;
    }

    public LiveData<Integer> getSubtotal() {
        return subtotalLiveData;
    }

    public LiveData<Integer> getDiscount() {
        return discountLiveData;
    }

    public LiveData<Integer> getTotal() {
        return totalLiveData;
    }

    public LiveData<String> getPromoCode() {
        return promoCodeLiveData;
    }

    public LiveData<Boolean> isSubmitting() {
        return isSubmittingLiveData;
    }

    public LiveData<Order> getOrderSuccess() {
        return orderSuccessLiveData;
    }

    public LiveData<String> getOrderError() {
        return orderErrorLiveData;
    }

    public void updateQuantity(String id, int delta) {
        cartManager.updateQuantity(id, delta);
    }

    public void removeItem(String id) {
        cartManager.removeItem(id);
    }

    public boolean applyPromo(String code) {
        return cartManager.applyPromo(code);
    }

    public void removePromo() {
        cartManager.removePromo();
    }

    public void setOrderType(String type) {
        cartManager.setOrderType(type);
    }

    public String getOrderType() {
        return cartManager.getOrderType();
    }

    public void setCustomerName(String name) {
        cartManager.setCustomerName(name);
    }

    public String getCustomerName() {
        return cartManager.getCustomerName();
    }

    public void setTableNumber(String table) {
        cartManager.setTableNumber(table);
    }

    public String getTableNumber() {
        return cartManager.getTableNumber();
    }

    public void submitOrder() {
        if (cartManager.getCartItems().isEmpty()) {
            orderErrorLiveData.setValue("Keranjang masih kosong.");
            return;
        }

        String name = cartManager.getCustomerName();
        if (name == null || name.trim().isEmpty()) {
            orderErrorLiveData.setValue("Silakan isi nama pemesan.");
            return;
        }

        isSubmittingLiveData.setValue(true);
        String note = cartManager.getTableNumber();

        repository.submitOrder(name, note, new CoffeeRepository.OrderCallback() {
            @Override
            public void onSuccess(Order createdOrder) {
                isSubmittingLiveData.postValue(false);
                cartManager.clear();
                orderSuccessLiveData.postValue(createdOrder);
            }

            @Override
            public void onError(String message) {
                isSubmittingLiveData.postValue(false);
                orderErrorLiveData.postValue(message);
            }
        });
    }

    private void refreshCart() {
        cartItemsLiveData.postValue(cartManager.getCartItems());
        subtotalLiveData.postValue(cartManager.getSubtotal());
        discountLiveData.postValue(cartManager.getDiscount());
        totalLiveData.postValue(cartManager.getTotalAmount());
        promoCodeLiveData.postValue(cartManager.getPromoCode());
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        cartManager.removeListener(this::refreshCart);
    }
}
