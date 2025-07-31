// src/store/account/accountStore.ts

import { defineStore } from 'pinia'
import { accountRepository } from '@/repository/account/accountRepository'

export const useAccountStore = defineStore('account', {
  state: () => ({
    accountId: '',
    email: '',
    name: '',
    nickname: '',
    phoneNum: '',
    address: '',
    gender: '',
    birth: '',
    payment: '',
    age: '',
    subscribe: false,
    accountRegister: '',
    accountPath: '',
    alarmBoardStatus: true, 
    alarmCommentStatus: true, 
  }),
  actions: {
    setAccount(account: any) {
      this.email = account.email
      this.accountRegister = account.account_register
      this.accountPath = account.account_path
    },

    setProfile(profile: any) {
      this.accountId = profile.account_id
      this.name = profile.account_name
      this.nickname = profile.account_nickname
      this.phoneNum = profile.phone_num
      this.address = profile.account_add
      this.gender = profile.account_sex
      this.birth = profile.account_birth
      this.payment = profile.account_pay
      this.age = profile.account_age
      this.subscribe = profile.account_sub
      this.alarmBoardStatus = profile.alarm_board_status
      this.alarmCommentStatus = profile.alarm_comment_status
      
      if (profile.role === 'ADMIN') {
        localStorage.setItem('isAdmin', 'true')
      } else {
        localStorage.setItem('isAdmin', 'false')
      }
    },

    async getAccount() {
      try {
        const profile = await accountRepository.getProfileInfo()
        this.setProfile(profile)
        return profile
      } catch (error) {
        console.error('❌ getAccount 실패:', error)
        throw error
      }
    },
    async loadAccount() {
      try {
        const account = await accountRepository.getAccountInfo()
        this.setAccount(account)
      } catch (error) {
        console.error('❌ 계정 정보 로드 실패:', error)
      }
    },

    async updateProfile(profileData: any) {
      try {
        const updatedProfile = await accountRepository.updateProfileInfo(profileData)
        this.setProfile(updatedProfile)
        return updatedProfile
      } catch (error) {
        await this.getAccount()
        console.error('❌ 프로필 수정 실패:', error)
        throw error
      }
    },

    async checkNickname(nickname: string) {
      try {
        const response = await accountRepository.checkNicknameDuplication(nickname)
        return response
      } catch (error) {
        console.error('❌ 닉네임 중복 확인 실패:', error)
        throw error
      }
    },

    async alarmSettings(type: string, status: boolean) {
      try {
        if (type === 'board') {
          this.alarmBoardStatus = status
        } else if (type === 'comment') {
          this.alarmCommentStatus = status
        }

        await accountRepository.updateProfileInfo({
          alarm_board_status: this.alarmBoardStatus,
          alarm_comment_status: this.alarmCommentStatus,
        })
      } catch (error) {
        console.error('❌ 알림 설정 변경 실패:', error)
        await this.getAccount()
      }
    }
  },
})



  
