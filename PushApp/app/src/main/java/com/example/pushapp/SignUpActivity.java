package com.example.pushapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.messaging.FirebaseMessaging;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SignUpActivity extends AppCompatActivity {

    private EditText signupId;
    private EditText signupPassword;
    private EditText signupPasswordCheck;
    private Button signupBtn;

    private Button goBackBtn;

    private static final String TAG = "SignupActivity";


    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.signup);
        signupId = findViewById(R.id.signupId);
        signupPassword = findViewById(R.id.signupPassword);
        signupPasswordCheck  =findViewById(R.id.signupPasswordCheck);
        signupBtn = findViewById(R.id.signupBtn);
        goBackBtn = findViewById(R.id.goBackBtn);


        goBackBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 이전 액티비티로 돌아가는 코드
                Intent intent = new Intent(SignUpActivity.this, MainActivity.class);
                startActivity(intent);
                finish(); // 현재 액티비티 종료
            }
        });
        signupBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String userId = signupId.getText().toString();
                String password = signupPassword.getText().toString();
                String passwordCheck = signupPasswordCheck.getText().toString();
                FirebaseMessaging.getInstance().getToken().addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        String token = task.getResult();
                        Log.i(TAG, token);
                        signup(userId, password,passwordCheck, token);
                    } else {
                        Toast.makeText(SignUpActivity.this, "토큰 획득 실패", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });
    }


    private void signup(String userId, String password, String passwordCheck, String token) {
        // 회원가입 API URL
        String apiUrl = BuildConfig.API_URL;
        String url = apiUrl + "/signup";

        // 요청 바디 생성
        RequestBody requestBody = new FormBody.Builder()
                .add("userId", userId)
                .add("password", password)
                .add("passwordCheck", passwordCheck)
                .add("token", token)
                .build();

        // 회원가입 요청 생성
        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();
        OkHttpClient client = new OkHttpClient();
        // 회원가입 요청 보내기
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // 요청 실패 처리

                e.printStackTrace();
                SignUpActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(SignUpActivity.this, "요청 오류", Toast.LENGTH_SHORT).show();

                    }
                });
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                // 응답 처리
                if (response.isSuccessful()) {
                    String responseData = response.body().string();
                    Log.i(TAG, (responseData));
                    try {
                        JSONObject json = new JSONObject(responseData);


                        boolean success = json.getBoolean("success");


                        if (success) {
                            // 로그인 성공
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(SignUpActivity.this, "회원가입 성공", Toast.LENGTH_SHORT).show();

                                    Intent intent = new Intent(SignUpActivity .this, MainActivity.class);
                                    startActivity(intent);
                                }
                            });
                        } else {
                            // 회원가입 실패
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(SignUpActivity.this, "아이디 또는 패스워드를 확인하세요.", Toast.LENGTH_SHORT).show();
                                }
                            });
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    // 응답 실패 처리
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(SignUpActivity.this, "아이디 또는 패스워드를 확인하세요.", Toast.LENGTH_SHORT).show();
                        }
                    });
                }
            }
        });
    }

}
