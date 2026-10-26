package com.kopikita.customer.model;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;

public class OrderItem implements Serializable {
    @SerializedName("id")
    private String id;

    @SerializedName("order_id")
    private String orderId;

    @SerializedName("product_id")
    private String productId;

    @SerializedName("product_name")
    private String productName;

    @SerializedName("quantity")
    private int quantity;

    @SerializedName("unit_price")
    private int unitPrice;

    @SerializedName("subtotal")
    private int subtotal;

    @SerializedName("size")
    private String size; // "Regular" or "Large"

    @SerializedName("temperature")
    private String temperature; // "Ice" or "Hot"

    @SerializedName("sugar_level")
    private String sugarLevel; // "Normal 100%", "Less Sugar 50%", "No Sugar 0%"

    @SerializedName("customization_notes")
    private String customizationNotes;

    public OrderItem() {
    }

    public OrderItem(String productId, String productName, int quantity, int unitPrice, int subtotal, String size, String temperature, String sugarLevel, String customizationNotes) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = subtotal;
        this.size = size;
        this.temperature = temperature;
        this.sugarLevel = sugarLevel;
        this.customizationNotes = customizationNotes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(int unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(int subtotal) {
        this.subtotal = subtotal;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getSugarLevel() {
        return sugarLevel;
    }

    public void setSugarLevel(String sugarLevel) {
        this.sugarLevel = sugarLevel;
    }

    public String getCustomizationNotes() {
        return customizationNotes;
    }

    public void setCustomizationNotes(String customizationNotes) {
        this.customizationNotes = customizationNotes;
    }
}
