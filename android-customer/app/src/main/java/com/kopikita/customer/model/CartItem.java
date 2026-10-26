package com.kopikita.customer.model;

import java.io.Serializable;
import java.util.Objects;

public class CartItem implements Serializable {
    private String id;
    private Product product;
    private int quantity;
    private String size;
    private String temperature;
    private String sugarLevel;
    private String iceLevel;
    private String notes;
    private int unitPrice;
    private int totalPrice;

    public CartItem(Product product, int quantity, String size, String temperature, String sugarLevel, String iceLevel, String notes) {
        this.product = product;
        this.quantity = quantity;
        this.size = size;
        this.temperature = temperature;
        this.sugarLevel = sugarLevel;
        this.iceLevel = iceLevel;
        this.notes = notes != null ? notes.trim() : "";

        int extra = "Large".equalsIgnoreCase(size) ? 4000 : 0;
        this.unitPrice = product.getPrice() + extra;
        this.totalPrice = this.unitPrice * quantity;
        this.id = generateId();
    }

    private String generateId() {
        return (product != null ? product.getId() : "") + "-" + size + "-" + temperature + "-" + sugarLevel + "-" + iceLevel + "-" + notes;
    }

    public String getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
        this.totalPrice = this.unitPrice * quantity;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
        int extra = "Large".equalsIgnoreCase(size) ? 4000 : 0;
        this.unitPrice = product.getPrice() + extra;
        this.totalPrice = this.unitPrice * this.quantity;
        this.id = generateId();
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
        this.id = generateId();
    }

    public String getSugarLevel() {
        return sugarLevel;
    }

    public void setSugarLevel(String sugarLevel) {
        this.sugarLevel = sugarLevel;
        this.id = generateId();
    }

    public String getIceLevel() {
        return iceLevel;
    }

    public void setIceLevel(String iceLevel) {
        this.iceLevel = iceLevel;
        this.id = generateId();
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes != null ? notes.trim() : "";
        this.id = generateId();
    }

    public int getUnitPrice() {
        return unitPrice;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartItem cartItem = (CartItem) o;
        return Objects.equals(id, cartItem.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
