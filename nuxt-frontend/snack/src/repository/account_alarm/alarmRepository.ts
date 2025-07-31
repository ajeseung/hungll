export const getUserAlarms = async () => {
    const { createAxiosInstance } = await import('@/common/utils/axiosInstance')
    const axios = createAxiosInstance()
    const response = await axios.get('/account-alarm/get-alarms')
    return response.data.data
  }
  
  export const readAlarm = async (alarmId: number) => {
    const { createAxiosInstance } = await import('@/common/utils/axiosInstance')
    const axios = createAxiosInstance()
    await axios.patch('/account-alarm/read-alarm', { alarm_id: alarmId })
  }
  