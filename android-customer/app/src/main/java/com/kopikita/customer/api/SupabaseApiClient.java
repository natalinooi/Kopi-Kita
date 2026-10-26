package com.kopikita.customer.api;

import com.kopikita.customer.utils.Constants;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class SupabaseApiClient {
    private static SupabaseApiService apiService;

    public static synchronized SupabaseApiService getService() {
        if (apiService == null) {
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient client = new OkHttpClient.Builder()
                    .connectTimeout(15, TimeUnit.SECONDS)
                    .readTimeout(15, TimeUnit.SECONDS)
                    .writeTimeout(15, TimeUnit.SECONDS)
                    .addInterceptor(new Interceptor() {
                        @Override
                        public Response intercept(Chain chain) throws IOException {
                            Request original = chain.request();
                            Request.Builder requestBuilder = original.newBuilder()
                                    .header("apikey", Constants.SUPABASE_ANON_KEY)
                                    .header("Authorization", "Bearer " + Constants.SUPABASE_ANON_KEY)
                                    .header("Content-Type", "application/json")
                                    .header("Accept", "application/json");
                            return chain.proceed(requestBuilder.build());
                        }
                    })
                    .addInterceptor(logging)
                    .build();

            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl(Constants.SUPABASE_BASE_URL)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            apiService = retrofit.create(SupabaseApiService.class);
        }
        return apiService;
    }
}
