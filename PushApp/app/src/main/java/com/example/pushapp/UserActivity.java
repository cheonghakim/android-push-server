

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
        import androidx.recyclerview.widget.LinearLayoutManager;
        import androidx.recyclerview.widget.RecyclerView;

        import com.example.pushapp.databinding.ActivityMainBinding;
        import com.google.common.reflect.TypeToken;
        import com.google.gson.Gson;
        import com.google.gson.JsonArray;
        import com.google.gson.JsonObject;

        import android.content.Intent;
        import android.view.View;
        import android.webkit.CookieManager;

        import android.util.Log;
        import android.view.MenuItem;
        import android.widget.EditText;
        import android.widget.TextView;
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

        // 리스트 가져오기
        getNewsLetters();

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_news, R.id.nav_slideshow)
                .setOpenableLayout(drawer)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        // 유저 아이디 셋팅
        SharedPreferences preferences = getSharedPreferences("Session", Context.MODE_PRIVATE);
        String userId = preferences.getString("userId", "");
        View headerView = navigationView.getHeaderView(0);
        TextView userNameText = headerView.findViewById(R.id.user_id_section);
       userNameText.setText(userId);

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
        MenuItem reload = menu.findItem(R.id.action_reload);

        reload.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                // 메뉴 아이템 클릭 이벤트 처리
                recreate();
                return true;
            }
        });
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

    private void getNewsLetters ( ) {
        // 뉴스 레터 API URL
        String apiUrl = BuildConfig.API_URL;
        String url = apiUrl + "/news";

        // 뉴스 레터 요청 생성
        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();
        OkHttpClient client = new OkHttpClient();
        // 뉴스 레터 요청 보내기
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
                if (response.isSuccessful()) {


                    try {
                        JSONObject json = new JSONObject(responseData);
                        boolean success = json.getBoolean("success");

                        if (success) {
                            // 뉴스 레터 정보 가져오기 성공
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    // Toast.makeText(UserActivity.this, "데이터를 가져옴", Toast.LENGTH_SHORT).show();
                                   
                                    // 데이터 처리
                                    Gson gson = new Gson();
                                    JsonObject jsonObject = gson.fromJson(responseData, JsonObject.class);
                                    JsonArray dataArray = jsonObject.getAsJsonArray("data");
                                    List<NewsItem> newsList = gson.fromJson(dataArray, new TypeToken<List<NewsItem>>(){}.getType());
                                    // RecyclerView 초기화
                                    RecyclerView recyclerView = findViewById(R.id.frag_news);

                                    // LayoutManager 설정 (LinearLayoutManager 또는 GridLayoutManager)
                                    LinearLayoutManager linearLayoutManager = new LinearLayoutManager(UserActivity.this);
                                    linearLayoutManager.setOrientation(LinearLayoutManager.VERTICAL);
                                    recyclerView.setLayoutManager(linearLayoutManager);

                                    // Adapter 설정
                                    NewsAdapter adapter = new NewsAdapter(newsList);
                                    recyclerView.setAdapter(adapter);
                                }
                            });
                        } else {
                            // 뉴스 레터 가져오기 실패
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
                    try {

                        JSONObject json = new JSONObject(responseData);
                        String msg = json.getString("message");
                        // 응답 실패 처리
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(UserActivity.this, msg, Toast.LENGTH_SHORT).show();
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    private void userLogout() {
        // 로그아웃 URL
        String apiUrl = BuildConfig.API_URL;
        String url = apiUrl + "/login/logout";

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
                    try {
                        String responseData = response.body().string();
                        JSONObject json = new JSONObject(responseData);
                        String msg = json.getString("message");
                        // 응답 실패 처리
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(UserActivity.this, msg, Toast.LENGTH_SHORT).show();
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
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