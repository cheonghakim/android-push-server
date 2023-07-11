package com.example.pushapp;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

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

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "Firebase";
    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);

        // FCM 토큰을 로그인할 때 보내는 로직을 구현하세요.
        sendTokenToServer(token);
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        // 수신한 메시지 처리
        if (remoteMessage.getNotification() != null) {
            // 알림 메시지인 경우
            String title = remoteMessage.getNotification().getTitle();
            String body = remoteMessage.getNotification().getBody();

            // 알림을 표시하는 메서드 호출
            showNotification(title, body);
        }

        // 기타 데이터 메시지 처리
        if (remoteMessage.getData().size() > 0) {
            // 데이터 처리 로직 추가
        }
    }

    private void showNotification(String title, String body) {
        // 알림 채널 생성 및 설정
        long currentTimeMillis = System.currentTimeMillis();
        int notificationId = (int) currentTimeMillis;
        String channelId = "news_letter_id";
        String channelName = "News Letters";
        int importance = NotificationManager.IMPORTANCE_HIGH;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId, channelName, importance);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }

        // 알림을 클릭했을 때 실행할 액티비티 지정
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 1, intent, PendingIntent.FLAG_IMMUTABLE);

        // 알림 스타일 설정
        NotificationCompat.BigTextStyle bigTextStyle = new NotificationCompat.BigTextStyle()
                .bigText(body);

        // 알림 생성
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(bigTextStyle) // 알림 스타일 설정
                .setPriority(NotificationCompat.PRIORITY_HIGH) // 중요도 설정
                .setDefaults(NotificationCompat.DEFAULT_ALL) // 기본 사운드, 진동 설정
                .setFullScreenIntent(pendingIntent, true) // 풀스크린 인텐트 설정
                .setAutoCancel(true);

        // 알림 표시
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        notificationManager.notify(notificationId, builder.build());
    }


    private void sendTokenToServer(String token) {
        // 새 FCM 토큰을 서버로 전송하는 로직
        // 토큰 업데이트 API URL
        String apiUrl = BuildConfig.API_URL;
        String url = apiUrl + "/login/token";

         SharedPreferences preferences = getSharedPreferences("Session", Context.MODE_PRIVATE);
         String userId = preferences.getString("userId", "");

        // 요청 바디 생성
        RequestBody requestBody = new FormBody.Builder()
                .add("user_id", userId)
                .add("token", token)
                .build();

        // 토큰 업데이트 요청 생성
        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();
        OkHttpClient client = new OkHttpClient();
        // 토큰 업데이트 요청 보내기
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // 요청 실패 처리

                e.printStackTrace();
                Toast.makeText(MyFirebaseMessagingService.this, "요청 오류", Toast.LENGTH_SHORT).show();
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
                            // 토큰 업데이트 성공
                            Toast.makeText(MyFirebaseMessagingService.this, "업데이트 성공", Toast.LENGTH_SHORT).show();


                        } else {
                            // 토큰 업데이트 실패
                            Toast.makeText(MyFirebaseMessagingService.this, "토큰 업데이트 실패.", Toast.LENGTH_SHORT).show();
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
                        Toast.makeText(MyFirebaseMessagingService.this, msg, Toast.LENGTH_SHORT).show();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
            }
        });
    }
}