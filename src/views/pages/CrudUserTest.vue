<template>
  <div class="card">
      <h1 class="text-2xl font-bold mb-4">Users</h1>
      <!-- <ul class="space-y-2">
          <li v-for="user in userStore.users" :key="user.id" class="flex justify-between items-center p-2 border-b">
              <div>
                  <span class="font-semibold">{{ user.name }}</span> - <span class="text-gray-600">{{ user.email }}</span>
              </div>
              <div>
                  <button @click="startEdit(user)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                  <button @click="deleteUser(user.id)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2">Delete</button>
              </div>
          </li>
      </ul>         -->
      <Toolbar class="mb-6">
          <template #start>
              <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
              <!-- <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedItems || !selectedItems.length" /> -->
          </template>
          <template #end>
              <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
          </template>
      </Toolbar>
      <DataTable ref="dt"
              :value="userStore.users"
              dataKey="id"
              :paginator="true"
              :rows="10"
              :filters="filters"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[5, 10, 25]"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">

          <template #header>
              <div class="flex flex-wrap gap-2 items-center justify-between">
                  <h4 class="m-0">Manage Users</h4>
                  <IconField>
                      <InputIcon>
                          <i class="pi pi-search" />
                      </InputIcon>
                      <InputText v-model="filters['global'].value" placeholder="Search..." />
                  </IconField>
              </div>
          </template>

          <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
          <Column field="email" header="Email" sortable style="min-width: 16rem"></Column>
          <Column :exportable="false" style="min-width: 12rem" header="Actions" alignFrozen="right" frozen>
              <template #body="slotProps">
                  <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="startEdit(slotProps.data)" />
                  <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteUser(slotProps.data.id)" />
              </template>
          </Column>
      </DataTable>
      <!-- Form untuk menambah atau mengedit pengguna -->
      <form @submit.prevent="isEditing ? updateUser() : createUser()" class="mt-6 space-y-4">
          <input v-model="newUser.name" placeholder="Name" required class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="newUser.email" placeholder="Email" required class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="newUser.password" type="password" placeholder="Password" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" class="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              {{ isEditing ? 'Update User' : 'Add User' }}
          </button>
      </form>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
const newUser = ref({ name: '', email: '', password: '' });
const isEditing = ref(false);
const dt = ref();
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
let editingUserId = null;

const fetchUsers = async () => {
  await userStore.fetchUsers();
};

const createUser = async () => {
  await userStore.createUser(newUser.value.name, newUser.value.email, newUser.value.password);
  resetForm();
};

const startEdit = (user) => {
  newUser.value = { name: user.name, email: user.email, password: '' }; // Password di-reset untuk keamanan
  editingUserId = user.id;
  isEditing.value = true;
};

const updateUser = async () => {
  await userStore.updateUser(editingUserId, newUser.value.name, newUser.value.email, newUser.value.password);
  resetForm();
};

const deleteUser = async (id) => {
  await userStore.deleteUser(id);
};

const resetForm = () => {
  newUser.value = { name: '', email: '', password: '' };
  isEditing.value = false;
  editingUserId = null;
};

onMounted(fetchUsers);
</script>
