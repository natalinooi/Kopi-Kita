package com.kopikita.customer.viewmodel;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.kopikita.customer.model.Product;
import com.kopikita.customer.repository.CoffeeRepository;
import com.kopikita.customer.utils.CartManager;
import java.util.ArrayList;
import java.util.List;

public class HomeViewModel extends AndroidViewModel {
    private final CoffeeRepository repository;
    private final CartManager cartManager;

    private final MutableLiveData<List<Product>> productsLiveData = new MutableLiveData<>();
    private final MutableLiveData<Boolean> loadingLiveData = new MutableLiveData<>(false);
    private final MutableLiveData<String> errorLiveData = new MutableLiveData<>();
    private final MutableLiveData<Integer> cartCountLiveData = new MutableLiveData<>(0);
    private final MutableLiveData<Integer> cartTotalLiveData = new MutableLiveData<>(0);

    private List<Product> allProducts = new ArrayList<>();
    private String selectedCategory = "Semua";

    public HomeViewModel(@NonNull Application application) {
        super(application);
        this.repository = new CoffeeRepository(application);
        this.cartManager = CartManager.getInstance();

        cartManager.addListener(this::updateCartState);
        updateCartState();
        fetchProducts();
    }

    public LiveData<List<Product>> getProducts() {
        return productsLiveData;
    }

    public LiveData<Boolean> isLoading() {
        return loadingLiveData;
    }

    public LiveData<String> getError() {
        return errorLiveData;
    }

    public LiveData<Integer> getCartCount() {
        return cartCountLiveData;
    }

    public LiveData<Integer> getCartTotal() {
        return cartTotalLiveData;
    }

    public void fetchProducts() {
        loadingLiveData.setValue(true);
        repository.getProducts(new CoffeeRepository.ProductCallback() {
            @Override
            public void onSuccess(List<Product> products) {
                loadingLiveData.postValue(false);
                allProducts = products != null ? products : new ArrayList<>();
                filterProducts();
            }

            @Override
            public void onError(String message) {
                loadingLiveData.postValue(false);
                errorLiveData.postValue(message);
            }
        });
    }

    public void setCategory(String category) {
        this.selectedCategory = category;
        filterProducts();
    }

    public void searchProducts(String query) {
        if (allProducts == null) return;
        List<Product> filtered = new ArrayList<>();
        String q = query != null ? query.trim().toLowerCase() : "";

        for (Product p : allProducts) {
            boolean matchesCat = "Semua".equalsIgnoreCase(selectedCategory) ||
                    (p.getCategory() != null && p.getCategory().equalsIgnoreCase(selectedCategory));
            boolean matchesSearch = q.isEmpty() ||
                    (p.getName() != null && p.getName().toLowerCase().contains(q)) ||
                    (p.getDescription() != null && p.getDescription().toLowerCase().contains(q));

            if (matchesCat && matchesSearch) {
                filtered.add(p);
            }
        }
        productsLiveData.setValue(filtered);
    }

    private void filterProducts() {
        searchProducts("");
    }

    private void updateCartState() {
        cartCountLiveData.postValue(cartManager.getTotalItems());
        cartTotalLiveData.postValue(cartManager.getTotalAmount());
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        cartManager.removeListener(this::updateCartState);
    }
}
