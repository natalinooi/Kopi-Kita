package com.kopikita.customer.ui.adapter;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;
import com.kopikita.customer.R;
import com.kopikita.customer.databinding.ItemCategoryPillBinding;
import java.util.ArrayList;
import java.util.List;

public class CategoryAdapter extends RecyclerView.Adapter<CategoryAdapter.CategoryViewHolder> {

    public interface OnCategoryClickListener {
        void onCategorySelected(String category);
    }

    private final List<String> categories = new ArrayList<>();
    private String selectedCategory = "Semua";
    private final OnCategoryClickListener listener;

    public CategoryAdapter(List<String> categories, OnCategoryClickListener listener) {
        if (categories != null) {
            this.categories.addAll(categories);
        }
        this.listener = listener;
    }

    public void setSelectedCategory(String category) {
        this.selectedCategory = category;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public CategoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemCategoryPillBinding binding = ItemCategoryPillBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new CategoryViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull CategoryViewHolder holder, int position) {
        holder.bind(categories.get(position));
    }

    @Override
    public int getItemCount() {
        return categories.size();
    }

    class CategoryViewHolder extends RecyclerView.ViewHolder {
        private final ItemCategoryPillBinding binding;

        public CategoryViewHolder(ItemCategoryPillBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(String category) {
            binding.tvCategoryName.setText(category);
            boolean isSelected = category.equalsIgnoreCase(selectedCategory);

            if (isSelected) {
                binding.cardCategory.setCardBackgroundColor(ContextCompat.getColor(itemView.getContext(), R.color.colorPrimary));
                binding.tvCategoryName.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.colorWhite));
            } else {
                binding.cardCategory.setCardBackgroundColor(ContextCompat.getColor(itemView.getContext(), R.color.colorSurface));
                binding.tvCategoryName.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.colorTextPrimary));
            }

            itemView.setOnClickListener(v -> {
                selectedCategory = category;
                notifyDataSetChanged();
                if (listener != null) {
                    listener.onCategorySelected(category);
                }
            });
        }
    }
}
