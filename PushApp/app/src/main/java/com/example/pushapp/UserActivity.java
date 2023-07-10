

package com.example.pushapp;

        import android.content.Context;
        import android.content.SharedPreferences;
        import android.net.Uri;
        import android.os.Build;
        import android.os.Bundle;
        import android.provider.Settings;
        import android.view.Menu;

        import com.google.android.material.navigation.NavigationView;


        import androidx.annotation.NonNull;
        import androidx.navigation.NavController;
        import androidx.navigation.Navigation;
        import androidx.navigation.ui.AppBarConfiguration;
        import androidx.navigation.ui.NavigationUI;
        import androidx.drawerlayout.widget.DrawerLayout;
        import androidx.appcompat.app.AppCompatActivity;

        import com.example.pushapp.databinding.ActivityMainBinding;
        import com.google.common.reflect.TypeToken;
        import com.google.gson.Gson;

        import android.content.Intent;
        import android.webkit.CookieManager;

        import android.util.Log;
        import android.view.MenuItem;
        import android.widget.Toast;

        import org.json.JSONException;
        import org.json.JSONObject;

        import java.io.IOException;
        import java.util.List;

        import okhttp3.Call;
        import okhttp3.Callback;
        import okhttp3.OkHttpClient;
        import okhttp3.Request;
        import okhttp3.Response;


public class UserActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;
    private ActivityMainBinding binding;

    private static final String TAG = "UserActivity";

    // 알림 권한 설정에 필요한 변수
    private static final int NOTIFICATION_PERMISSION_REQUEST_CODE = 200;
    private static final String PREFS_NAME = "MyPrefs";
    private static final String NOTIFICATION_PERMISSION_KEY = "notification_permission";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.appBarMain.toolbar);

        getNewsLetters();

        // 우측 하단 메일 버튼
//        binding.appBarMain.fab.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                        .setAction("Action", null).show();
//            }
//        });

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.newsLettersMenu, R.id.nav_slideshow)
                .setOpenableLayout(drawer)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        navigationView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                int id = item.getItemId();
                // 특정 버튼 클릭 이벤트 처리
                if  (id == R.id.newsLettersMenu) {
                    // API 호출 및 데이터 가져오기
                    getNewsLetters();
                    return true;
                }
                return false;
            }
        });

//        setProps();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        MenuItem alarmSetting = menu.findItem(R.id.action_settings);
        MenuItem logout = menu.findItem(R.id.action_logout);

        alarmSetting.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                // 메뉴 아이템 클릭 이벤트 처리
                openNotificationSettings();
                return true;
            }
        });

        logout.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                // 메뉴 아이템 클릭 이벤트 처리
                userLogout();
                return true;
            }
        });

        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

    private void setProps() {
        // 아이디 설정
        // UserActivity에서 전달된 데이터 받기
//        Intent intent = getIntent();
//        String userId = intent.getStringExtra("user_id");
//
//        // 받아온 데이터를 사용하여 작업 수행
//        // 예시: 받아온 userId를 TextView에 설정
//        TextView textView = findViewById(R.id.user_id_section);
//
//        textView.setText( userId );


    }

    private void getNewsLetters ( ) {
        // 뉴스 레터 API URL
        String url = "http://10.165.130.84:8090/api/push/v1/news";

        // 로그인 요청 생성
        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();
        OkHttpClient client = new OkHttpClient();
        // 로그인 요청 보내기
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // 요청 실패 처리

                e.printStackTrace();
                UserActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(UserActivity.this, "요청 오류", Toast.LENGTH_SHORT).show();

                    }
                });
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                // 응답 처리
                String responseData = response.body().string();
                Log.i(TAG, (responseData));
                if (response.isSuccessful()) {


                    try {
                        JSONObject json = new JSONObject(responseData);
                        boolean success = json.getBoolean("success");

                        if (success) {
                            // 로그인 성공
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(UserActivity.this, "데이터를 가져옴", Toast.LENGTH_SHORT).show();
                                    // 로그인 성공 후 다음 화면으로 이동 등의 로직을 수행합니다.
                                    Gson gson = new Gson();
                                    List<NewsItem> newsList = gson.fromJson(responseData, new TypeToken<List<NewsItem>>(){}.getType());

                                    NewsAdapter adapter =  new NewsAdapter(newsList);
                                }
                            });
                        } else {
                            // 로그인 실패
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(UserActivity.this, "리스트를 가져오지 못했습니다.", Toast.LENGTH_SHORT).show();
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
                            Toast.makeText(UserActivity.this, "리스트를 가져오지 못했습니다.", Toast.LENGTH_SHORT).show();
                        }
                    });
                }
            }
        });
    }

    private void userLogout() {
        // 로그아웃 URL
        String url = "http://10.165.130.84:8090/api/push/v1/login/logout";

        // 로그아웃 요청 생성
        Request request = new Request.Builder()
                .url(url)
                .delete()
                .build();
        OkHttpClient client = new OkHttpClient();
        // 로그인 요청 보내기
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // 요청 실패 처리

                e.printStackTrace();
                UserActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(UserActivity.this, "요청 오류", Toast.LENGTH_SHORT).show();

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
                            // 로그아웃 성공
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    deleteCookie();
                                    deleteSession();

                                    Intent intent = new Intent(UserActivity.this, MainActivity.class);
                                    startActivity(intent);
                                    Toast.makeText(UserActivity.this, "로그아웃 되었습니다.", Toast.LENGTH_SHORT).show();
                                }
                            });
                        } else {
                            // 로그인 실패
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(UserActivity.this, "로그아웃하지 못했습니다.", Toast.LENGTH_SHORT).show();
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
                            Toast.makeText(UserActivity.this, "로그아웃하지 못했습니다.", Toast.LENGTH_SHORT).show();
                        }
                    });
                }
            }
        });
    }

    private void deleteCookie() {
        CookieManager.getInstance().removeAllCookies(null);
    }

    private void deleteSession() {
        SharedPreferences preferences = getSharedPreferences("Session", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.clear(); // 모든 값을 삭제합니다
        editor.apply();
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


}