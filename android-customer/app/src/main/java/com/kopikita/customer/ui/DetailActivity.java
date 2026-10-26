package com.kopikita.customer.ui;

import android.os.Build;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.kopikita.customer.R;
import com.kopikita.customer.databinding.ActivityDetailBinding;
import com.kopikita.customer.model.CartItem;
import com.kopikita.customer.model.Product;
import com.kopikita.customer.utils.CartManager;
import com.kopikita.customer.utils.RupiahFormatter;

public class DetailActivity extends AppCompatActivity {

    private ActivityDetailBinding binding;
    private Product product;
    private String selectedSize = "Regular";
    private String selectedSugar = "Normal 100%";
    private String selectedIce = "Normal Ice";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        loadProductData();
        setupToolbar();
        setupOptions();
        setupAddToCartButton();
        updatePriceDisplay();
    }

    private void loadProductData() {
        if (getIntent() != null && getIntent().hasExtra("product")) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                product = getIntent().getSerializableExtra("product", Product.class);
            } else {
                product = (Product) getIntent().getSerializableExtra("product");
            }
        }

        if (product == null) {
            Toast.makeText(this, "Produk tidak ditemukan", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        binding.tvDetailTitle.setText(product.getName());
        binding.tvDetailDesc.setText(product.getDescription() != null ? product.getDescription() : "Artisanal signature roastery.");
    }

    private void setupToolbar() {
        binding.toolbarDetail.setNavigationOnClickListener(v -> finish());
    }

    private void setupOptions() {
        // Size selection
        binding.rgSize.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.rbLarge) {
                selectedSize = "Large";
                binding.tvSizeIndicator.setText("16 oz (Large)");
            } else {
                selectedSize = "Regular";
                binding.tvSizeIndicator.setText("12 oz (Regular)");
            }
            updatePriceDisplay();
        });

        // Sweetness selection
        binding.cgSweetness.setOnCheckedStateChangeListener((group, checkedIds) -> {
            if (checkedIds.contains(R.id.chipSugarLess)) {
                selectedSugar = "Less 50%";
            } else if (checkedIds.contains(R.id.chipSugarNo)) {
                selectedSugar = "No Sugar 0%";
            } else {
                selectedSugar = "Normal 100%";
            }
        });

        // Ice selection
        binding.cgIce.setOnCheckedStateChangeListener((group, checkedIds) -> {
            if (checkedIds.contains(R.id.chipIceLess)) {
                selectedIce = "Less Ice";
            } else if (checkedIds.contains(R.id.chipIceNo)) {
                selectedIce = "No Ice";
            } else {
                selectedIce = "Normal Ice";
            }
        });
    }

    private void updatePriceDisplay() {
        if (product == null) return;
        int unitPrice = product.getPrice() + ("Large".equalsIgnoreCase(selectedSize) ? 4000 : 0);
        binding.tvDetailPrice.setText(RupiahFormatter.format(unitPrice));
        binding.btnAddToCart.setText("Tambah ke Keranjang • " + RupiahFormatter.format(unitPrice));
    }

    private void setupAddToCartButton() {
        binding.btnAddToCart.setOnClickListener(v -> {
            if (product == null) return;

            String notes = "";
            if (binding.etDetailNotes.getText() != null) {
                notes = binding.etDetailNotes.getText().toString().trim();
            }

            CartItem cartItem = new CartItem(
                    product,
                    1,
                    selectedSize,
                    "Ice",
                    selectedSugar,
                    selectedIce,
                    notes
            );

            CartManager.getInstance().addItem(cartItem);
            Toast.makeText(this, product.getName() + " (" + selectedSize + ") ditambahkan!", Toast.LENGTH_SHORT).show();
            finish();
        });
    }
}
