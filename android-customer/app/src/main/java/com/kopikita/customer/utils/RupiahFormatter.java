package com.kopikita.customer.utils;

import java.text.NumberFormat;
import java.util.Locale;

public class RupiahFormatter {
    private static final Locale LOCALE_ID = new Locale("id", "ID");

    public static String format(int amount) {
        NumberFormat formatter = NumberFormat.getNumberInstance(LOCALE_ID);
        return "Rp " + formatter.format(amount);
    }
}
