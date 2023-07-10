package com.example.pushapp;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);

        // FCM 토큰을 로그인할 때 보내는 로직을 구현하세요.
        sendTokenToServer(token);
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        // 메시지를 수신했을 때 처리하는 로직을 구현하세요.
    }

    private void sendTokenToServer(String token) {
        // FCM 토큰을 서버로 전송하는 로직을 구현하세요.
        // 여기에서 로그인 API를 호출하고 토큰을 함께 전달할 수 있습니다.
    }
}