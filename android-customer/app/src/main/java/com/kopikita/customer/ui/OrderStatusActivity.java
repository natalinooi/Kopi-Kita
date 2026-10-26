package com.kopikita.customer.ui;

import android.os.Build;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import com.kopikita.customer.R;
import com.kopikita.customer.databinding.ActivityOrderStatusBinding;
import com.kopikita.customer.model.Order;
import com.kopikita.customer.repository.CoffeeRepository;
import com.kopikita.customer.utils.RupiahFormatter;
import java.util.List;

public class OrderStatusActivity extends AppCompatActivity {

    private ActivityOrderStatusBinding binding;
    private CoffeeRepository repository;
    private Order currentOrder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOrderStatusBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        repository = new CoffeeRepository(this);

        setupToolbar();
        loadOrderData();
        setupActionButtons();
    }

    private void setupToolbar() {
        binding.toolbarStatus.setNavigationOnClickListener(v -> finish());
    }

    private void loadOrderData() {
        if (getIntent() != null && getIntent().hasExtra("order")) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                currentOrder = getIntent().getSerializableExtra("order", Order.class);
            } else {
                currentOrder = (Order) getIntent().getSerializableExtra("order");
            }
        }

        if (currentOrder == null) {
            List<Order> localOrders = repository.getLocalOrders();
            if (localOrders != null && !localOrders.isEmpty()) {
                currentOrder = localOrders.get(0);
            }
        }

        if (currentOrder == null) {
            // Default sample order if no previous order exists
            currentOrder = new Order(
                    "KPK-1088",
                    "Pelanggan Kopi Kita",
                    "dine_in",
                    "pesanan_masuk",
                    22000,
                    0,
                    "qris",
                    "paid",
                    "Dine In (Meja: 03)"
            );
            currentOrder.setId("ord-sample-1");
        }

        renderOrderDetails();
    }

    private void renderOrderDetails() {
        if (currentOrder == null) return;

        binding.tvOrderNumberHero.setText("PESANAN #" + (currentOrder.getOrderNumber() != null ? currentOrder.getOrderNumber() : "KPK-001"));
        binding.tvCustomerDetail.setText("Pemesan: " + currentOrder.getCustomerName() + " • " +
                ("dine_in".equalsIgnoreCase(currentOrder.getOrderType()) ? "Dine In" : "Take Away"));
        binding.tvNotesDetail.setText("Catatan: " + (currentOrder.getNotes() != null ? currentOrder.getNotes() : "-"));
        binding.tvTotalDetail.setText("Total Lunas: " + RupiahFormatter.format(currentOrder.getTotalAmount()) + " (QRIS)");

        updateStepVisuals(currentOrder.getStatus());
    }

    private void updateStepVisuals(String status) {
        int colorPrimary = ContextCompat.getColor(this, R.color.colorPrimary);
        int colorSuccess = ContextCompat.getColor(this, R.color.colorSuccess);
        int colorBorder = ContextCompat.getColor(this, R.color.colorBorder);
        int colorTextPrimary = ContextCompat.getColor(this, R.color.colorTextPrimary);
        int colorTextMuted = ContextCompat.getColor(this, R.color.colorTextMuted);
        int colorWhite = ContextCompat.getColor(this, R.color.colorWhite);

        if ("sedang_diseduh".equalsIgnoreCase(status)) {
            // Hero
            binding.cardStatusHero.setCardBackgroundColor(colorPrimary);
            binding.tvStatusTitle.setText("Sedang Diseduh Barista ☕");
            binding.tvStatusDesc.setText("Barista sedang mengekstraksi espresso dan memanaskan susu segar.");

            // Step 1: Completed
            binding.tvStep1Dot.setBackgroundColor(colorSuccess);
            binding.tvStep1Dot.setText("✓");
            binding.tvStep1Dot.setTextColor(colorWhite);
            binding.tvStep1Title.setTextColor(colorTextMuted);

            // Step 2: In progress
            binding.tvStep2Dot.setBackgroundResource(R.drawable.bg_promo_banner);
            binding.tvStep2Dot.setText("2");
            binding.tvStep2Dot.setTextColor(colorWhite);
            binding.tvStep2Title.setTextColor(colorPrimary);

            // Step 3: Pending
            binding.tvStep3Dot.setBackgroundColor(colorBorder);
            binding.tvStep3Dot.setText("3");
            binding.tvStep3Dot.setTextColor(colorTextPrimary);
            binding.tvStep3Title.setTextColor(colorTextMuted);

        } else if ("siap_diambil".equalsIgnoreCase(status) || "selesai".equalsIgnoreCase(status)) {
            // Hero
            binding.cardStatusHero.setCardBackgroundColor(colorSuccess);
            binding.tvStatusTitle.setText("Siap Diambil di Pick-Up Bar! 🔔");
            binding.tvStatusDesc.setText("Pesanan siap disajikan. Tunjukkan nomor pesanan ini ke barista.");

            // Step 1: Completed
            binding.tvStep1Dot.setBackgroundColor(colorSuccess);
            binding.tvStep1Dot.setText("✓");
            binding.tvStep1Dot.setTextColor(colorWhite);
            binding.tvStep1Title.setTextColor(colorTextMuted);

            // Step 2: Completed
            binding.tvStep2Dot.setBackgroundColor(colorSuccess);
            binding.tvStep2Dot.setText("✓");
            binding.tvStep2Dot.setTextColor(colorWhite);
            binding.tvStep2Title.setTextColor(colorTextMuted);

            // Step 3: Ready
            binding.tvStep3Dot.setBackgroundColor(colorSuccess);
            binding.tvStep3Dot.setText("✓");
            binding.tvStep3Dot.setTextColor(colorWhite);
            binding.tvStep3Title.setTextColor(colorSuccess);

        } else {
            // Default: "pesanan_masuk"
            binding.cardStatusHero.setCardBackgroundColor(colorPrimary);
            binding.tvStatusTitle.setText("Pesanan Telah Diterima ✓");
            binding.tvStatusDesc.setText("Barista slow bar sedang menyiapkan cangkir & tiket pesanan Anda.");

            // Step 1: Active
            binding.tvStep1Dot.setBackgroundResource(R.drawable.bg_promo_banner);
            binding.tvStep1Dot.setText("1");
            binding.tvStep1Dot.setTextColor(colorWhite);
            binding.tvStep1Title.setTextColor(colorPrimary);

            // Step 2: Pending
            binding.tvStep2Dot.setBackgroundColor(colorBorder);
            binding.tvStep2Dot.setText("2");
            binding.tvStep2Dot.setTextColor(colorTextPrimary);
            binding.tvStep2Title.setTextColor(colorTextMuted);

            // Step 3: Pending
            binding.tvStep3Dot.setBackgroundColor(colorBorder);
            binding.tvStep3Dot.setText("3");
            binding.tvStep3Dot.setTextColor(colorTextPrimary);
            binding.tvStep3Title.setTextColor(colorTextMuted);
        }
    }

    private void setupActionButtons() {
        binding.btnSimulateStatus.setOnClickListener(v -> {
            if (currentOrder == null) return;

            String nextStatus;
            String cur = currentOrder.getStatus();
            if ("pesanan_masuk".equalsIgnoreCase(cur)) {
                nextStatus = "sedang_diseduh";
            } else if ("sedang_diseduh".equalsIgnoreCase(cur)) {
                nextStatus = "siap_diambil";
            } else {
                nextStatus = "pesanan_masuk";
            }

            currentOrder.setStatus(nextStatus);
            repository.updateLocalOrderStatus(currentOrder.getId(), nextStatus);
            renderOrderDetails();

            Toast.makeText(this, "Status diubah ke: " + nextStatus, Toast.LENGTH_SHORT).show();
        });

        binding.btnBackHome.setOnClickListener(v -> finish());
    }
}
