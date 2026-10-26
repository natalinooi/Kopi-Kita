package com.kopikita.customer.model;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;
import java.util.List;

public class Order implements Serializable {
    @SerializedName("id")
    private String id;

    @SerializedName("order_number")
    private String orderNumber;

    @SerializedName("customer_name")
    private String customerName;

    @SerializedName("order_type")
    private String orderType; // "dine_in" or "take_away"

    @SerializedName("status")
    private String status; // "pesanan_masuk", "sedang_diseduh", "siap_diambil", "selesai"

    @SerializedName("total_amount")
    private int totalAmount;

    @SerializedName("discount_amount")
    private int discountAmount;

    @SerializedName("payment_method")
    private String paymentMethod; // "qris"

    @SerializedName("payment_status")
    private String paymentStatus; // "paid"

    @SerializedName("cashier_name")
    private String cashierName;

    @SerializedName("notes")
    private String notes;

    @SerializedName("created_at")
    private String createdAt;

    @SerializedName("updated_at")
    private String updatedAt;

    @SerializedName("items")
    private List<OrderItem> items;

    public Order() {
    }

    public Order(String orderNumber, String customerName, String orderType, String status, int totalAmount, int discountAmount, String paymentMethod, String paymentStatus, String notes) {
        this.orderNumber = orderNumber;
        this.customerName = customerName;
        this.orderType = orderType;
        this.status = status;
        this.totalAmount = totalAmount;
        this.discountAmount = discountAmount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.notes = notes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(int totalAmount) {
        this.totalAmount = totalAmount;
    }

    public int getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(int discountAmount) {
        this.discountAmount = discountAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getCashierName() {
        return cashierName;
    }

    public void setCashierName(String cashierName) {
        this.cashierName = cashierName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}
