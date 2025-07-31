import { defineStore } from 'pinia'
import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const useAccountAlarmStore = defineStore('accountAlarm', {
  state: () => ({
    alarms: [] as any[],
    unreadCount: 0,
  }),

  actions: {
    async fetchAlarms() {
        try {
          const token = localStorage?.getItem('userToken') || ''
          console.log('토큰:', token)
          const axios = createAxiosInstance(token)
          console.log('헤더:', axios.defaults.headers)
          const response = await axios.get('/account-alarm/get-alarms')
          this.alarms = response.data.data.alarms
          this.unreadCount = response.data.data.unread_count
        } catch (err) {
          console.error('알림 불러오기 실패:', err)
        }
      },
      

      async readAlarm(alarmId: number) {
        try {
          const token = localStorage.getItem('userToken') || ''
          const axios = createAxiosInstance(token)
          await axios.patch('/account-alarm/read-alarm', { alarm_id: alarmId })
          this.alarms = this.alarms.filter(alarm => alarm.alarm_id !== alarmId)
          this.unreadCount = Math.max(this.unreadCount - 1, 0)
        } catch (err) {
          console.error('알림 읽음 처리 실패:', err)
        }
      },     
  },
})
