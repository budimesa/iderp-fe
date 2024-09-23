<template>
    <div class="card">
      <Toolbar class="mb-6">
          <template #start>
            <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
          </template>
          <template #end>
            <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
          </template>
        </Toolbar>
        <DataTable v-model:filters="filters" :value="userStore.users" paginator showGridlines :rows="10" dataKey="id"
                filterDisplay="menu" :globalFilterFields="['name', 'email']">
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty>No Users found.</template>
  
            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>
            </Column>
  
            <Column field="email" header="Email" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.email }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by email" />
                </template>
            </Column>
  
            <Column header="Created At" filterField="created_at" dataType="date" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ formatDate(data.created_at) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
                </template>
            </Column>
  
            <Column header="Created By" field="created_by" style="min-width: 12rem"></Column>
            <Column header="Updated At" field="updated_at" style="min-width: 12rem">
              <template #body="{ data }">
                    {{ formatDate(data.updated_at) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
                </template>
            </Column>
            <Column header="Updated By" field="updated_by" style="min-width: 12rem"></Column>
  
            <Column :exportable="false" header="Actions" alignFrozen="right" frozen>
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="edit(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
    <Dialog v-model:visible="formDialog" :style="{ width: '450px' }" header="Brand Details" :modal="true">
        <div class="flex flex-col gap-6">
          <div>
            <label for="name" class="block font-bold mb-3">Name</label>
            <InputText id="name" v-model.trim="item.name" required fluid autofocus :invalid="submitted && !item.email"/>
            <small v-if="submitted && !item.name" class="text-red-500">Name is required.</small>
          </div>
          <div>
            <label for="email" class="block font-bold mb-3">Email</label>
            <InputText id="email" v-model="item.email" required fluid />
            <small v-if="submitted && !item.email" class="text-red-500">Email is required.</small>
          </div>          
        </div>
  
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
          <Button label="Save" icon="pi pi-check" @click="save" :disabled="isSaving" />
        </template>
      </Dialog>
  
        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="item"
                    >Are you sure you want to delete <b>{{ item.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteItem" />
            </template>
        </Dialog>
  
        <Dialog v-model:visible="deleteBulkDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="item">Are you sure you want to delete the selected users?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteBulkDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedItems" />
            </template>
        </Dialog>
  </template>

<script setup>
import { useUserStore } from '@/stores/user';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const dt = ref();
const loading = ref(true);
const items = ref([]);
const formDialog = ref(false);
const deleteDialog = ref(false);
const item = ref({});
const filters = ref({});
const submitted = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);

onMounted(() => {
    fetchUsers();
});

// const fetchData = async () => {
//     try {
//         const response = await axios.get(route('brands.index'));
//         items.value = response.data.brands.map(brand => ({
//             ...brand,
//             created_at: new Date(brand.created_at), // Convert to Date object
//             updated_at: new Date(brand.updated_at)
//         }));
//     } catch (error) {
//         console.error('Error fetching brands:', error);
//     } finally {
//         loading.value = false;
//     }
// };

const fetchUsers = async () => {
    await userStore.fetchUsers();
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        brand_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        brand_code: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        created_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    };
};

initFilters();

const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('en-US');
};

const clearFilter = () => {
    initFilters();
};

const openNew = () => {
    item.value = { brand_name: '', brand_code: '' };
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
  if (item.value.brand_name.trim() && item.value.brand_code.trim()) {
    isSaving.value = true; // Set to true before starting the process
    try {
      if (isEditMode.value) {
        await axios.put(route('brands.update', item.value.id), {
          brand_name: item.value.brand_name,
          brand_code: item.value.brand_code,
        });
        toast.add({ severity: 'success', summary: 'Success', detail: 'Brand updated successfully', life: 3000 });
      } else {
        await axios.post(route('brands.store'), {
          brand_name: item.value.brand_name,
          brand_code: item.value.brand_code,
        });
        toast.add({ severity: 'success', summary: 'Success', detail: 'Brand created successfully', life: 3000 });
      }
      fetchData();
      hideDialog();
    } catch (error) {
      console.error('Error saving brand:', error.response.data);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save brand', life: 3000 });
    } finally {
      isSaving.value = false; // Set to false after the process is complete
    }
  }
};
const edit = (brandData) => {
  item.value = { ...brandData };
  submitted.value = false;
  isEditMode.value = true;
  formDialog.value = true;
};
const confirmDelete = (emp) => {
  item.value = emp;
  deleteDialog.value = true;
};
const deleteItem = async () => {
  await axios.delete(route('brands.destroy', item.value.id));
  deleteDialog.value = false;
  fetchData();
  toast.add({severity:'success', summary: 'Successful', detail: 'Brand Deleted', life: 3000});
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const userStore = useUserStore();
const newUser = ref({ name: '', email: '', password: '' });
const isEditing = ref(false);
let editingUserId = null;

// const createUser = async () => {
//     await userStore.createUser(newUser.value.name, newUser.value.email, newUser.value.password);
//     resetForm();
// };

// const startEdit = (user) => {
//     newUser.value = { name: user.name, email: user.email, password: '' }; // Password di-reset untuk keamanan
//     editingUserId = user.id;
//     isEditing.value = true;
// };

// const updateUser = async () => {
//     await userStore.updateUser(editingUserId, newUser.value.name, newUser.value.email, newUser.value.password);
//     resetForm();
// };

// const deleteUser = async (id) => {
//     await userStore.deleteUser(id);
// };

const resetForm = () => {
    newUser.value = { name: '', email: '', password: '' };
    isEditing.value = false;
    editingUserId = null;
};
</script>
