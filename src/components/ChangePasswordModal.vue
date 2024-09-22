<template>
    <Dialog header="Change Password" :visible="visible" @hide="onHide" modal>
      <div class="p-fluid">
        <div class="p-field">
          <label for="currentPassword">Current Password</label>
          <InputText
            id="currentPassword"
            v-model="form.currentPassword"
            type="password"
            required
          />
        </div>
        <div class="p-field">
          <label for="newPassword">New Password</label>
          <InputText
            id="newPassword"
            v-model="form.newPassword"
            type="password"
            required
          />
        </div>
        <div class="p-field">
          <label for="confirmPassword">Confirm New Password</label>
          <InputText
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="onHide" />
        <Button label="Change" icon="pi pi-check" @click="submit" />
      </template>
    </Dialog>
  </template>
  
  <script setup>
  import { useConfigStore } from '@/stores/configStore';
import axios from 'axios';
import { defineEmits, ref } from 'vue';
  
  const props = defineProps(['visible']);
  const emit = defineEmits(['hide']);
  
  const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const configStore = useConfigStore();
  
  const submit = async () => {
    if (form.value.newPassword !== form.value.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${configStore.baseUrl}/change-password`,
        {
          current_password: form.value.currentPassword,
          new_password: form.value.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Password changed successfully!");
      onHide();
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password. Please try again.");
    }
  };
  
  const onHide = () => {
    emit('hide');
    form.value.currentPassword = '';
    form.value.newPassword = '';
    form.value.confirmPassword = '';
  };
  </script>
  
  <style scoped>
  /* Add any specific styles for your modal here */
  </style>
  