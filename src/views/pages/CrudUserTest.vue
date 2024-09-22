<template>
    <div class="card mx-4">
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
                v-model:selection="selectedItems"
                :value="items"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
            
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Colors</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>
              <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
              <Column field="id" header="ID" sortable style="min-width: 12rem"></Column>
              <Column field="color_name" header="Color Name" sortable style="min-width: 16rem"></Column>
              <Column field="color_code" header="Color Code" sortable style="min-width: 12rem"></Column>
              <Column field="created_at" header="Created At" sortable style="min-width: 12rem"></Column>
              <Column field="created_by" header="Created By" sortable style="min-width: 12rem"></Column>
              <Column field="updated_at" header="Update At" sortable style="min-width: 12rem"></Column>
              <Column field="updated_by" header="Update By" sortable style="min-width: 12rem"></Column>
              <Column :exportable="false" style="min-width: 12rem" header="Actions" alignFrozen="right" frozen>
              <template #body="slotProps">
                  <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="edit(slotProps.data)" />
                  <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)" />
              </template>
          </Column>
        </DataTable>
    </div>
  
      <Dialog v-model:visible="formDialog" :style="{ width: '450px' }" header="Color Details" :modal="true">
        <div class="flex flex-col gap-6">
          <div>
            <label for="color_code" class="block font-bold mb-3">Color Code</label>
            <InputText id="color_code" v-model="item.color_code" required autofocus :invalid="submitted && !item.color_code" fluid />
            <small v-if="submitted && !item.color_code" class="text-red-500">Color Code is required.</small>
          </div>
          <div>
            <label for="color_name" class="block font-bold mb-3">Color Name</label>
            <InputText id="color_name" v-model.trim="item.color_name" required fluid />
            <small v-if="submitted && !item.color_name" class="text-red-500">Color Name is required.</small>
          </div>        
        </div>
  
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
          <Button label="Save" icon="pi pi-check" @click="save" :disabled="isSaving" />
        </template>
      </Dialog>
  
  </template>
  
  <script setup>
  import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
  
  import axios from 'axios';
  
  onMounted(() => {
    fetchData();
  });
  
  const fetchData = async () => {
      try {
          const response = await axios.get(route('colors.index'));
          items.value = response.data.colors;
      } catch (error) {
          console.error('Error fetching colors:', error);
      }
  };
  
  const toast = useToast();
  const dt = ref();
  const items = ref([]);
  const formDialog = ref(false);
  const deleteDialog = ref(false);
  const deleteBulkDialog = ref(false);
  const item = ref({});
  const selectedItems = ref([]);
  const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
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
        if (isEditMode.value) {
          await axios.put(route('colors.update', item.value.id), {
            color_name: item.value.color_name,
            color_code: item.value.color_code,
          });
          toast.add({ severity: 'success', summary: 'Success', detail: 'Color updated successfully', life: 3000 });
        } else {
          await axios.post(route('colors.store'), {
            color_name: item.value.color_name,
            color_code: item.value.color_code,
          });
          toast.add({ severity: 'success', summary: 'Success', detail: 'Color created successfully', life: 3000 });
        }
        fetchData();
        hideDialog();
      } catch (error) {
        console.error('Error saving color:', error.response.data);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save color', life: 3000 });
      } finally {
        isSaving.value = false; // Set to false after the process is complete
      }
    }
  };
  const edit = (colorData) => {
    item.value = { ...colorData };
    submitted.value = false;
    isEditMode.value = true;
    formDialog.value = true;
  };
  const confirmDelete = (emp) => {
    item.value = emp;
    deleteDialog.value = true;
  };
  const deleteItem = async () => {
    await axios.delete(route('colors.destroy', item.value.id));
    deleteDialog.value = false;
    fetchData();
    toast.add({severity:'success', summary: 'Successful', detail: 'Color Deleted', life: 3000});
  };
  const exportCSV = () => {
    dt.value.exportCSV();
  };
  const confirmDeleteSelected = () => {
    deleteBulkDialog.value = true;
  };
  const deleteSelectedItems = () => {
    items.value = items.value.filter((val) => !selectedItems.value.includes(val));
    deleteBulkDialog.value = false;
    selectedItems.value = null;
    toast.add({severity:'success', summary: 'Successful', detail: 'Colors Deleted', life: 3000});
  };
  </script>
  
  <style scoped>
  
  
  </style>