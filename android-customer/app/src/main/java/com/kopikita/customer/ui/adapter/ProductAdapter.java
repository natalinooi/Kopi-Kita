package com.kopikita.customer.ui.adapter;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.kopikita.customer.databinding.ItemProductCardBinding;
import com.kopikita.customer.model.Product;
import com.kopikita.customer.utils.RupiahFormatter;
import java.util.ArrayList;
import java.util.List;

public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ProductViewHolder> {

    public interface OnProductClickListener {
        void onProductClick(Product product);
        void onProductAddClick(Product product);
    }

    private final List<Product> productList = new ArrayList<>();
    private final OnProductClickListener listener;

    public ProductAdapter(OnProductClickListener listener) {
        this.listener = listener;
    }

    public void setProducts(List<Product> products) {
        this.productList.clear();
        if (products != null) {
            this.productList.addAll(products);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemProductCardBinding binding = ItemProductCardBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new ProductViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ProductViewHolder holder, int position) {
        holder.bind(productList.get(position));
    }

    @Override
    public int getItemCount() {
        return productList.size();
    }

    class ProductViewHolder extends RecyclerView.ViewHolder {
        private final ItemProductCardBinding binding;

        public ProductViewHolder(ItemProductCardBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(Product product) {
            binding.tvProductName.setText(product.getName());
            binding.tvProductDesc.setText(product.getDescription() != null ? product.getDescription() : "Artisanal signature roastery.");
            binding.tvProductPrice.setText(RupiahFormatter.format(product.getPrice()));
            binding.tvCategoryBadge.setText(product.getCategory());

            // Bind artisanal product photography
            String resKey = "img_" + product.getName().toLowerCase().replaceAll("[^a-z0-9]", "_");
            int resId = itemView.getContext().getResources().getIdentifier(resKey, "drawable", itemView.getContext().getPackageName());
            if (resId != 0) {
                binding.imgProduct.setImageResource(resId);
                binding.imgProduct.setLayoutParams(new android.widget.FrameLayout.LayoutParams(
                        android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                        android.view.ViewGroup.LayoutParams.MATCH_PARENT
                ));
                binding.imgProduct.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
            } else {
                binding.imgProduct.setImageResource(com.kopikita.customer.R.drawable.ic_coffee_cup);
            }

            itemView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onProductClick(product);
                }
            });

            binding.btnAdd.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onProductAddClick(product);
                }
            });
        }
    }
}
