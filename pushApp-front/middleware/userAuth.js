export default function ({ app, redirect }) {
    const sessionId = app?.$cookies?.get('sessionId')
    // 로그인되지 않은 경우 리다이렉트
    if (sessionId) {
      return redirect('/admin/main')
    }
  }