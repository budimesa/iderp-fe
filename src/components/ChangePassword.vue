<template>
    <Dialog v-model:visible="formDialog" :style="{ width: '450px' }" header="Color Details" :modal="true">
      <div class="flex flex-col gap-6">
        <div>
          <label for="currentPassword" class="block font-bold mb-3">Current Password</label>
          <InputText
            id="currentPassword"
            v-model="currentPassword"
            required
            fluid
            toggleMask
            class="w-full"
          />
          <!-- <small v-if="submitted && !item.color_code" class="text-red-500">Color Code is required.</small> -->
        </div>
        <div>
          <label for="newPassword" class="block font-bold mb-3">New Password</label>
          <InputText
            id="newPassword"
            v-model="newPassword"
            required
            toggleMask
            class="w-full"
          />
          <!-- <small v-if="submitted && !item.color_name" class="text-red-500">Color Name is required.</small> -->
        </div>
        <div>
          <label for="confirmPassword" class="block font-bold mb-3">Confirm New Password</label>
          <InputText
            id="confirmPassword"
            v-model="confirmPassword"
            required
            toggleMask
            class="w-full"
          />
          <!-- <small v-if="submitted && !item.color_name" class="text-red-500">Color Name is required.</small> -->
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="save" :disabled="isSaving" />
      </template>
    </Dialog>
  </template>
  
  <script setup>
  import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref } from 'vue';
  
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
  });
  
  const emit = defineEmits(['close']);
  
  const currentPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const errorMessage = ref('');
  const toast = useToast();
  const formDialog = ref(false);
  const item = ref({});
  const submitted = ref(false);
  const isEditMode = ref(false);
  const isSaving = ref(false);

const openNew = () => {
    item.value = { color_name: '', color_code: '' };
    submitted.value = false;
    isEditMode.value = false;
    formDialog.value = true;
};
const hideDialog = () => {
  formDialog.value = false;
  submitted.value = false;
};
const save = async () => {
  submitted.value = true;
  
  if (item.value.color_name.trim() && item.value.color_code.trim()) {
    isSaving.value = true; // Set to true before starting the process
    try {
        await axios.post(route('colors.store'), {
          color_name: item.value.color_name,
          color_code: item.value.color_code,
        });
        toast.add({ severity: 'success', summary: 'Success', detail: 'Color created successfully', life: 3000 });
        hideDialog();
    } catch (error) {
      console.error('Error saving color:', error.response.data);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save color', life: 3000 });
    } finally {
      isSaving.value = false; // Set to false after the process is complete
    }
  }
};
  
  const changePassword = async () => {
    errorMessage.value = ''; // Reset error message
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'New passwords do not match.';
      return;
    }
  
    try {
      await axios.post('/api/change-password', {
        current_password: currentPassword.value,
        new_password: newPassword.value,
      });
      // Optionally, emit an event or reset the form
      emit('close');
    } catch (error) {
      if (error.response && error.response.data.message) {
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = 'An error occurred. Please try again.';
      }
    }
  };
  
  const closeModal = () => {
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    errorMessage.value = '';
    emit('close');
  };
  </script>
  
  <style scoped>
  .p-error {
    color: red;
  }
  </style>
  