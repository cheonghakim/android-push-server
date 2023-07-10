package com.example.pushapp.ui.newsletter;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.pushapp.databinding.FragmentNewslettersBinding;

public class NewsLetterFragment extends Fragment {

    private FragmentNewslettersBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        NewsLetterViewModel newsLetterViewModel =
                new ViewModelProvider(this).get(NewsLetterViewModel.class);

        binding = FragmentNewslettersBinding.inflate(inflater, container, false);
        View root = binding.getRoot();


        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}