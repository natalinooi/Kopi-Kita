package com.kopikita.customer.ui;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.kopikita.customer.R;
import com.kopikita.customer.databinding.ActivityCheckoutBinding;
import com.kopikita.customer.databinding.DialogQrisPaymentBinding;
import com.kopikita.customer.model.Order;
import com.kopikita.customer.ui.adapter.CartAdapter;
import com.kopikita.customer.utils.RupiahFormatter;
import com.kopikita.customer.viewmodel.CartViewModel;

public class CheckoutActivity extends AppCompatActivity {

    private ActivityCheckoutBinding binding;
    private CartViewModel cartViewModel;
    private CartAdapter cartAdapter;
    private int currentTotal = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityCheckoutBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        cartViewModel = new ViewModelProvider(this).get(CartViewModel.class);

        setupToolbar();
        setupOrderType();
        setupCartRecyclerView();
        setupPromoSection();
        setupPayButton();
        observeViewModel();
    }

    private void setupToolbar() {
        binding.toolbarCheckout.setNavigationOnClickListener(v -> finish());
    }

    private void setupOrderType() {
        binding.rgOrderType.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.rbTakeAway) {
                cartViewModel.setOrderType("take_away");
                binding.etTableNumber.setHint("Pickup Note (Opsional)");
            } else {
                cartViewModel.setOrderType("dine_in");
                binding.etTableNumber.setHint("Nomor Meja *");
            }
        });
    }

    private void setupCartRecyclerView() {
        cartAdapter = new CartAdapter((itemId, delta) -> {
            cartViewModel.updateQuantity(itemId, delta);
        });

        binding.rvCartItems.setLayoutManager(new LinearLayoutManager(this));
        binding.rvCartItems.setAdapter(cartAdapter);
    }

    private void setupPromoSection() {
        binding.btnApplyPromo.setOnClickListener(v -> {
            if (binding.etPromoCode.getText() != null) {
                String code = binding.etPromoCode.getText().toString().trim();
                boolean applied = cartViewModel.applyPromo(code);
                if (applied) {
                    Toast.makeText(this, "Kupon " + code.toUpperCase() + " berhasil diterapkan!", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(this, "Kode promo tidak valid. Coba 'SENJA30' atau 'KOPIKITA5K'", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void setupPayButton() {
        binding.btnPayNow.setOnClickListener(v -> {
            String name = "";
            if (binding.etCustomerName.getText() != null) {
                name = binding.etCustomerName.getText().toString().trim();
            }

            if (name.isEmpty()) {
                binding.etCustomerName.setError("Silakan isi nama pemesan");
                binding.etCustomerName.requestFocus();
                return;
            }

            String table = "";
            if (binding.etTableNumber.getText() != null) {
                table = binding.etTableNumber.getText().toString().trim();
            }

            if (cartViewModel.getOrderType().equals("dine_in") && table.isEmpty()) {
                binding.etTableNumber.setError("Silakan isi nomor meja");
                binding.etTableNumber.requestFocus();
                return;
            }

            cartViewModel.setCustomerName(name);
            cartViewModel.setTableNumber(table.isEmpty() ? "Bawa Pulang" : table);

            showQrisDialog();
        });
    }

    private void showQrisDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        DialogQrisPaymentBinding dialogBinding = DialogQrisPaymentBinding.inflate(LayoutInflater.from(this));
        dialog.setContentView(dialogBinding.getRoot());

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            dialog.getWindow().setLayout(
                    (int) (getResources().getDisplayMetrics().widthPixels * 0.90),
                    android.view.ViewGroup.LayoutParams.WRAP_CONTENT
            );
        }

        dialogBinding.tvDialogTotal.setText(RupiahFormatter.format(currentTotal));
        String orderNum = "KPK-" + (System.currentTimeMillis() % 10000);
        dialogBinding.tvDialogOrderNum.setText("No. Tagihan: #" + orderNum);

        dialogBinding.btnConfirmPaid.setOnClickListener(v -> {
            dialog.dismiss();
            cartViewModel.submitOrder();
        });

        dialog.show();
    }

    private void observeViewModel() {
        cartViewModel.getCartItems().observe(this, items -> {
            cartAdapter.setCartItems(items);
            if (items == null || items.isEmpty()) {
                Toast.makeText(this, "Keranjang belanja kosong", Toast.LENGTH_SHORT).show();
                finish();
            }
        });

        cartViewModel.getSubtotal().observe(this, subtotal -> {
            if (subtotal != null) {
                binding.tvSubtotal.setText(RupiahFormatter.format(subtotal));
            }
        });

        cartViewModel.getDiscount().observe(this, discount -> {
            if (discount != null && discount > 0) {
                binding.layoutDiscountRow.setVisibility(View.VISIBLE);
                binding.tvDiscount.setText("-" + RupiahFormatter.format(discount));
            } else {
                binding.layoutDiscountRow.setVisibility(View.GONE);
            }
        });

        cartViewModel.getTotal().observe(this, total -> {
            if (total != null) {
                currentTotal = total;
                binding.tvTotalAmount.setText(RupiahFormatter.format(total));
                binding.btnPayNow.setText("Bayar Sekarang (QRIS) • " + RupiahFormatter.format(total));
            }
        });

        cartViewModel.getPromoCode().observe(this, code -> {
            if (code != null && !code.isEmpty()) {
                binding.tvPromoApplied.setVisibility(View.VISIBLE);
                binding.tvPromoApplied.setText("✓ Kupon " + code + " aktif");
            } else {
                binding.tvPromoApplied.setVisibility(View.GONE);
            }
        });

        cartViewModel.isSubmitting().observe(this, isSubmitting -> {
            if (isSubmitting != null && isSubmitting) {
                binding.btnPayNow.setEnabled(false);
                binding.btnPayNow.setText("Memproses Pesanan...");
            } else {
                binding.btnPayNow.setEnabled(true);
            }
        });

        cartViewModel.getOrderSuccess().observe(this, order -> {
            if (order != null) {
                Toast.makeText(this, "Pembayaran Berhasil! Pesanan diteruskan ke Barista.", Toast.LENGTH_LONG).show();
                Intent intent = new Intent(CheckoutActivity.this, OrderStatusActivity.class);
                intent.putExtra("order", order);
                startActivity(intent);
                finish();
            }
        });

        cartViewModel.getOrderError().observe(this, error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(this, error, Toast.LENGTH_LONG).show();
            }
        });
    }
}
