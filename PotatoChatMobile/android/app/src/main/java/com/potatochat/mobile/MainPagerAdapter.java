package com.potatochat.mobile;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class MainPagerAdapter extends FragmentStateAdapter {
    
    public MainPagerAdapter(@NonNull FragmentActivity fragmentActivity) {
        super(fragmentActivity);
    }
    
    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:
                return new HomeFragment();
            case 1:
                return new ChatFragment();
            case 2:
                return new TradingFragment();
            case 3:
                return new ProfileFragment();
            default:
                return new HomeFragment();
        }
    }
    
    @Override
    public int getItemCount() {
        return 4;
    }
}

