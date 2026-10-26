package com.kopikita.customer.ui.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.kopikita.customer.databinding.ItemCartBinding;
import com.kopikita.customer.model.CartItem;
import com.kopikita.customer.utils.RupiahFormatter;
import java.util.ArrayList;
import java.util.List;

public class CartAdapter extends RecyclerView.Adapter<CartAdapter.CartViewHolder> {

    public interface OnCartItemActionListener {
        void onUpdateQty(String itemId, int delta);
    }

    private final List<CartItem> cartList = new ArrayList<>();
    private final OnCartItemActionListener listener;

    public CartAdapter(OnCartItemActionListener listener) {
        this.listener = listener;
    }

    public void setCartItems(List<CartItem> items) {
        this.cartList.clear();
        if (items != null) {
            this.cartList.addAll(items);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public CartViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemCartBinding binding = ItemCartBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new CartViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull CartViewHolder holder, int position) {
        holder.bind(cartList.get(position));
    }

    @Override
    public int getItemCount() {
        return cartList.size();
    }

    class CartViewHolder extends RecyclerView.ViewHolder {
        private final ItemCartBinding binding;

        public CartViewHolder(ItemCartBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(CartItem item) {
            binding.tvCartItemName.setText(item.getProduct().getName());

            String options = item.getSize() + " • " + item.getSugarLevel() + " • " + item.getIceLevel();
            binding.tvCartItemOptions.setText(options);

            if (item.getNotes() != null && !item.getNotes().isEmpty()) {
                binding.tvCartItemNotes.setVisibility(View.VISIBLE);
                binding.tvCartItemNotes.setText("* " + item.getNotes());
            } else {
                binding.tvCartItemNotes.setVisibility(View.GONE);
            }

            binding.tvCartItemPrice.setText(RupiahFormatter.format(item.getTotalPrice()));
            binding.tvQuantity.setText(String.valueOf(item.getQuantity()));

            binding.btnMinus.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onUpdateQty(item.getId(), -1);
                }
            });

            binding.btnPlus.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onUpdateQty(item.getId(), 1);
                }
            });
        }
    }
}
