package com.kopikita.customer.ui;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.kopikita.customer.databinding.ActivityMainBinding;
import com.kopikita.customer.model.CartItem;
import com.kopikita.customer.model.Product;
import com.kopikita.customer.ui.adapter.CategoryAdapter;
import com.kopikita.customer.ui.adapter.ProductAdapter;
import com.kopikita.customer.utils.CartManager;
import com.kopikita.customer.utils.Constants;
import com.kopikita.customer.utils.RupiahFormatter;
import com.kopikita.customer.viewmodel.HomeViewModel;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private HomeViewModel homeViewModel;
    private ProductAdapter productAdapter;
    private CategoryAdapter categoryAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        homeViewModel = new ViewModelProvider(this).get(HomeViewModel.class);

        setupCategories();
        setupProductGrid();
        setupSearchAndPromo();
        setupCartBar();
        observeViewModel();
    }

    private void setupCategories() {
        List<String> categories = Arrays.asList(
                "Semua",
                "Signature Espresso",
                "Manual Brew",
                "Non-Coffee & Artisan Tea",
                "Artisan Pastry"
        );

        categoryAdapter = new CategoryAdapter(categories, category -> {
            homeViewModel.setCategory(category);
        });

        binding.rvCategories.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        binding.rvCategories.setAdapter(categoryAdapter);
    }

    private void setupProductGrid() {
        productAdapter = new ProductAdapter(new ProductAdapter.OnProductClickListener() {
            @Override
            public void onProductClick(Product product) {
                Intent intent = new Intent(MainActivity.this, DetailActivity.class);
                intent.putExtra("product", product);
                startActivity(intent);
            }

            @Override
            public void onProductAddClick(Product product) {
                CartItem item = new CartItem(
                        product,
                        1,
                        "Regular",
                        "Ice",
                        "Normal 100%",
                        "Normal Ice",
                        ""
                );
                CartManager.getInstance().addItem(item);
                Toast.makeText(MainActivity.this, product.getName() + " ditambahkan ke keranjang", Toast.LENGTH_SHORT).show();
            }
        });

        binding.rvProducts.setLayoutManager(new GridLayoutManager(this, 2));
        binding.rvProducts.setAdapter(productAdapter);
    }

    private void setupSearchAndPromo() {
        binding.etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                homeViewModel.searchProducts(s != null ? s.toString() : "");
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        binding.btnClaimPromo.setOnClickListener(v -> {
            boolean applied = CartManager.getInstance().applyPromo(Constants.PROMO_SENJA30);
            if (applied) {
                Toast.makeText(this, "Kupon SENJA30 aktif! Diskon 30% akan diterapkan pada checkout.", Toast.LENGTH_LONG).show();
            }
        });

        binding.btnOrderStatusShortcut.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, OrderStatusActivity.class);
            startActivity(intent);
        });
    }

    private void setupCartBar() {
        binding.btnViewCart.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, CheckoutActivity.class);
            startActivity(intent);
        });

        binding.bottomCartBar.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, CheckoutActivity.class);
            startActivity(intent);
        });
    }

    private void observeViewModel() {
        homeViewModel.isLoading().observe(this, isLoading -> {
            binding.progressBar.setVisibility(isLoading != null && isLoading ? View.VISIBLE : View.GONE);
        });

        homeViewModel.getProducts().observe(this, products -> {
            productAdapter.setProducts(products);
        });

        homeViewModel.getCartCount().observe(this, count -> {
            if (count != null && count > 0) {
                binding.bottomCartBar.setVisibility(View.VISIBLE);
                binding.tvCartCountBadge.setText(count + "x");
            } else {
                binding.bottomCartBar.setVisibility(View.GONE);
            }
        });

        homeViewModel.getCartTotal().observe(this, total -> {
            if (total != null) {
                binding.tvBottomCartTotal.setText(RupiahFormatter.format(total));
            }
        });

        homeViewModel.getError().observe(this, error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        homeViewModel.fetchProducts();
    }
}
