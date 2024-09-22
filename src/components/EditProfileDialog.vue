<template>
    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '40rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Username</label>
            <InputText id="username" class="flex-auto" v-model="username" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="email" class="font-semibold w-24">Email</label>
            <InputText id="email" class="flex-auto" v-model="email" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="closeDialog"></Button>
            <Button type="button" label="Save" @click="saveChanges"></Button>
        </div>
    </Dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['update:visible']);

const username = ref('');
const email = ref('');

const closeDialog = () => {
    emit('update:visible', false);
};

const saveChanges = () => {
    // Logika untuk menyimpan perubahan
    closeDialog();
};
</script>
