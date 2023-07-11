<script lang="ts">
import Vue, { ref } from 'vue'
import { useRouter } from '@nuxtjs/composition-api'
import LoginAPI from '../api/app/LoginAPI'
import Utils from '@/static/utils'

export default Vue.extend({
  name: 'LoginPage',
  middleware: ['userAuth'],
  setup() {
    const router = useRouter()
    const userId = ref('')
    const password = ref('')

    const adminLogin = async () => {
      try {
        if (!checkValidations()) return
        const loginData = {
          userId: userId.value,
          password: password.value,
        }
        const { data } = await LoginAPI.v1.login(loginData)
        if (data && data.success) {
          // login(loginData)
          router.push('/admin/main')
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const checkValidations = () => {
      if (Utils.isEmpty(userId.value)) {
        console.error('아이디를 입력하세요.')
        return false
      }

      if (Utils.isEmpty(password.value)) {
        console.error('패스워드를 입력하세요.')
        return false
      }

      return true
    }

    return {
      userId,
      password,
      adminLogin,
      checkValidations,
    }
  },
})
</script>

<template>
  <section>
    <div class="card">
      <div class="card-body">
        <input
          v-model="userId"
          type="text"
          placeholder="아이디"
          class="form-control"
        />

        <input
          v-model="password"
          type="text"
          placeholder="패스워드"
          class="form-control"
        />
        <button class="btn btn-success w-lg" @click="adminLogin">로그인</button>
      </div>
    </div>
  </section>
</template>
