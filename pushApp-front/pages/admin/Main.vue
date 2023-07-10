<script lang="ts">
import Vue, { onMounted, reactive, ref } from 'vue'
import AlarmAPI from '../../api/admin/AlramAPI'
import CommonAPI from '../../api/admin/CommonAPI'
import { dataType } from '../../api/admin/types/AlarmType'
import Utils from '../../static/utils'

export default Vue.extend({
  name: 'IndexPage',
  middleware: ['auth'],
  setup() {
    const alarmData: dataType = reactive({
      title: '',
      body: '',
      targets: [],
      selectAll: false,
    })
    const userList = ref([])

    const checkValidation = () => {
      if (Utils.isEmpty(alarmData.title)) {
        console.error('제목을 입력해 주세요.')
        return false
      }

      if (Utils.isEmpty(alarmData.body)) {
        console.error('내용을 입력해 주세요.')
        return false
      }

      if (
        !alarmData.selectAll &&
        (!alarmData.targets ||
          (alarmData.targets && alarmData.targets.length === 0))
      ) {
        console.error('대상을 선택해 주세요.')
        return false
      }

      return true
    }

    const onSend = async () => {
      try {
        if (!checkValidation()) return
        const { data } = await AlarmAPI.v1.sendAlarm({
          title: alarmData.title,
          body: alarmData.body,
          targets: alarmData.targets,
        })
        if (data && data.success) {
          console.log('발송 성공!')
        } else {
          console.log(data.message)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const getUserList = async () => {
      try {
        const { data } = await CommonAPI.v1.getUserList()
        if (data && data.success) {
          console.log(data)
          userList.value = data
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(() => {
      getUserList()
    })

    return { userList, alarmData, onSend, getUserList }
  },
})
</script>

<template>
  <section>
    <div class="card">
      <div class="card-body">
        <input
          v-model="alarmData.title"
          type="text"
          class="form-control"
          placeholder="제목"
          maxlength="100"
        />

        <textarea
          v-model="alarmData.body"
          class="form-control"
          cols="30"
          rows="10"
          placeholder="내용"
          maxlength="500"
        ></textarea>

        <b-form-checkbox
          id="checkbox-1"
          v-model="alarmData.selectAll"
          name="checkbox-1"
        >
          전체 발송
        </b-form-checkbox>

        <select
          class="form-control"
          :disabled="alarmData.selectAll"
          placeholder="대상"
          multiple
        >
          <option v-for="(item, index) in userList" :key="index"></option>
        </select>

        <button @click="onSend" class="btn btn-success w-lg">발송</button>
      </div>
    </div>
  </section>
</template>
