package com.kopikita.customer.api;

import com.kopikita.customer.model.Order;
import com.kopikita.customer.model.OrderItem;
import com.kopikita.customer.model.Product;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface SupabaseApiService {

    @GET("products?is_available=eq.true&order=name.asc")
    Call<List<Product>> getAvailableProducts();

    @Headers("Prefer: return=representation")
    @POST("orders")
    Call<List<Order>> createOrder(@Body Order order);

    @Headers("Prefer: return=representation")
    @POST("order_items")
    Call<List<OrderItem>> createOrderItems(@Body List<OrderItem> items);

    @GET("orders")
    Call<List<Order>> getOrderDetails(
            @Query("id") String idFilter,
            @Query("select") String selectQuery
    );
}
