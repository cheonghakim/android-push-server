//package com.example.pushapp;
//
//import android.app.Service;
//
//public class ForegroundService extends Service {
//
//    private static final int SERVICE_NOTIFICATION_ID = 1;
//
//    private static final String CHANNEL_ID = "ForegroundServiceChannel";
//    private final IBinder binder = new LocalBinder();
//
//    @Override
//    public IBinder onBind(Intent intent) {
//        // 클라이언트와 상호작용을 위한 IBinder 객체 반환
//        return binder;
//    }
//
//    // 클라이언트와 상호작용하기 위한 메소드
//    public void performTask() {
//        // 작업 수행
//    }
//
//    // 클라이언트와 상호작용하기 위한 Binder 클래스
//    public class LocalBinder extends Binder {
//        MyService getService() {
//            // 현재 서비스 인스턴스 반환
//            return MyService.this;
//        }
//    }
//
//    @Override
//    public void onCreate() {
//        super.onCreate();
//    }
//
//    @Override
//    public int onStartCommand(Intent intent, int flags, int startId) {
//        // Foreground Service를 시작하고 알림을 표시합니다.
//        startForeground(SERVICE_NOTIFICATION_ID, createNotification());
//
//        // 로그인 로직 등의 작업을 수행합니다.
//        performLogin();
//
//        // 작업이 완료되면 Foreground Service를 종료하지 않고 계속 유지합니다.
//        return START_STICKY;
//    }
//
//    private Notification createNotification() {
//        // Foreground 알림을 생성합니다.
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            NotificationChannel channel = new NotificationChannel(
//                    CHANNEL_ID,
//                    "Foreground Service Channel",
//                    NotificationManager.IMPORTANCE_DEFAULT
//            );
//            NotificationManager notificationManager = getSystemService(NotificationManager.class);
//            notificationManager.createNotificationChannel(channel);
//        }
//
//        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
//                .setContentTitle("Foreground Service")
//                .setContentText("앱이 실행 중입니다.")
//                .setSmallIcon(R.drawable.ic_notification);
//
//        return builder.build();
//    }
//
//    @Nullable
//    @Override
//    public IBinder onBind(Intent intent) {
//        return null;
//    }
//}