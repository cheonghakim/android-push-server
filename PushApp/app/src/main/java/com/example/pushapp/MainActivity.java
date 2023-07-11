package com.example.pushapp;

import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationManagerCompat;

import com.example.pushapp.databinding.ActivityMainBinding;

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

import android.widget.EditText;
import android.widget.Button;
import android.widget.Toast;

import com.google.firebase.messaging.FirebaseMessaging;

import android.util.Log;
import android.content.SharedPreferences;
import android.content.Context;


public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private EditText userNameEditText;
    private EditText userPwEditText;
    private Button loginButton;

    private Button routeSignupBtn;

    private static final String TAG = "MainActivity";


    private static final int NOTIFICATION_PERMISSION_REQUEST_CODE = 200;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestNotificationPermission();
        if (!isLoggedIn()) {
            setContentView(R.layout.login);
            userNameEditText = findViewById(R.id.editTextUserName);
            userPwEditText = findViewById(R.id.editTextUserPw);
            loginButton = findViewById(R.id.loginButton);
            routeSignupBtn = findViewById(R.id.routeSignupBtn);

            routeSignupBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(MainActivity.this, SignUpActivity.class);
                    startActivity(intent);
                }
            });

            loginButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    String username = userNameEditText.getText().toString();
                    String password = userPwEditText.getText().toString();
                    FirebaseMessaging.getInstance().getToken().addOnCompleteListener(task -> {
                        if (task.isSuccessful()) {
                            String token = task.getResult();
                            Log.i(TAG, token);
                            login(username, password, token);
                        } else {
                            Toast.makeText(MainActivity.this, "토큰 획득 실패", Toast.LENGTH_SHORT).show();
                        }
                    });
                }
            });
        } else {
            Intent intent = new Intent(MainActivity.this, UserActivity.class);
            startActivity(intent);
            finish();
        }
    }

    private void login(String username, String password, String token) {
        // 로그인 API URL
        String apiUrl = BuildConfig.API_URL;
        String url = apiUrl + "/login";

        // 요청 바디 생성
        RequestBody requestBody = new FormBody.Builder()
                .add("user_id", username)
                .add("password", password)
              .add("token", token)
                .build();

        // 로그인 요청 생성
        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();
        OkHttpClient   client = new OkHttpClient();
        // 로그인 요청 보내기
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // 요청 실패 처리

                e.printStackTrace();
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(MainActivity.this, "요청 오류", Toast.LENGTH_SHORT).show();

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

                        String sessionId = response.header("Set-Cookie");
                        Log.i(TAG, sessionId);
                        if (success) {
                            // 로그인 성공
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(MainActivity.this, "로그인 성공", Toast.LENGTH_SHORT).show();
                                    // 로그인 성공 후 다음 화면으로 이동 등의 로직을 수행합니다.

                                    SharedPreferences preferences = getSharedPreferences("Session", Context.MODE_PRIVATE);
                                    SharedPreferences.Editor editor = preferences.edit();
                                    editor.putString("sessionId", sessionId);
                                    editor.putString("userId", username);
                                    editor.apply();

                                    // 세션 식별자 가져오기 => api 쓸 때 가져오기
                                    // SharedPreferences preferences = getSharedPreferences("Session", Context.MODE_PRIVATE);
                                    // String sessionId = preferences.getString("sessionId", "");

                                    Intent intent = new Intent(MainActivity.this, UserActivity.class);


                                    // 액티비티 전환
                                    startActivity(intent);

                                    // 현재 액티비티 종료
                                    finish();
                                }
                            });
                        } else {
                            // 로그인 실패
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(MainActivity.this, "아이디 또는 패스워드를 확인하세요.", Toast.LENGTH_SHORT).show();
                                }
                            });
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    try {
                        String responseData = response.body().string();
                        JSONObject json = new JSONObject(responseData);
                        String msg = json.getString("message");
                        // 응답 실패 처리
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
            }
        });
    }

//    private boolean checkLoginValidation() {
//
//    }
    private boolean isLoggedIn() {
        SharedPreferences preferences = getSharedPreferences("Session", Context.MODE_PRIVATE);
        String sessionId = preferences.getString("sessionId", "");
        return !sessionId.isEmpty();
    }

    private void requestNotificationPermission() {
        if (!NotificationManagerCompat.from(this).areNotificationsEnabled()) {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("알림 권한 요청")
                    .setMessage("알림을 받으려면 알림 권한이 필요합니다. 설정으로 이동하여 알림 권한을 활성화하시겠습니까?")
                    .setPositiveButton("예", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            openNotificationSettings();
                        }
                    })
                    .setNegativeButton("아니오", null)
                    .show();
        } else {
            // 알림 권한이 이미 허용된 경우
            // 필요한 동작 수행
            Toast.makeText(MainActivity.this, "알림권한이 설정되어 있습니다.", Toast.LENGTH_SHORT).show();
        }
    }

    private void openNotificationSettings() {
        Intent intent = new Intent();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, getPackageName());
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra("app_package", getPackageName());
            intent.putExtra("app_uid", getApplicationInfo().uid);
        } else {
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.addCategory(Intent.CATEGORY_DEFAULT);
            intent.setData(Uri.parse("package:" + getPackageName()));
        }
        startActivityForResult(intent, NOTIFICATION_PERMISSION_REQUEST_CODE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == NOTIFICATION_PERMISSION_REQUEST_CODE) {
            if (NotificationManagerCompat.from(this).areNotificationsEnabled()) {
                // 알림 권한이 허용된 경우
                // 필요한 동작 수행
                Toast.makeText(MainActivity.this, "알림 권한이 설정 되었습니다.", Toast.LENGTH_SHORT).show();
            } else {
                // 알림 권한이 거부된 경우
                // 사용자에게 알림 권한을 허용해야 한다는 안내 메시지 표시
                Toast.makeText(MainActivity.this, "알림을 받으려면 권한을 설정해야 합니다.", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
