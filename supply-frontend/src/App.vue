<template>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1 class="header-title">Supply Management System</h1>
    </header>

    <!-- Alert for messages -->
    <div v-if="alertMessage" :class="[
      'alert',
      alertType === 'success' ? 'alert-success' : 'alert-error'
    ]">
      {{ alertMessage }}
    </div>

    <!-- Add/Edit Supply Form -->
    <div class="card form-container">
      <h2 class="card-title">{{ isEditing ? 'Edit Supply' : 'Add New Supply' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="qty">Quantity</label>
            <input 
              type="number" 
              id="qty" 
              v-model="formData.qty" 
              class="form-input" 
              min="0" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="unit">Unit</label>
            <input 
              type="text" 
              id="unit" 
              v-model="formData.unit" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="category">Category</label>
            <input 
              type="text" 
              id="category" 
              v-model="formData.category" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="supplier">Supplier</label>
            <input 
              type="text" 
              id="supplier" 
              v-model="formData.supplier" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="cost">Cost</label>
            <input 
              type="number" 
              id="cost" 
              v-model="formData.cost" 
              class="form-input" 
              min="0" 
              step="0.01" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="location">Location</label>
            <input 
              type="text" 
              id="location" 
              v-model="formData.location" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group description">
            <label class="form-label" for="description">Description</label>
            <input 
              type="text" 
              id="description" 
              v-model="formData.description" 
              class="form-input" 
              required
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button 
            v-if="isEditing" 
            type="button" 
            class="btn btn-secondary" 
            @click="cancelEdit"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
          >
            {{ isEditing ? 'Update' : 'Add' }} Supply
          </button>
        </div>
      </form>
    </div>
    
    <!-- Supply List Table -->
    <div class="card table-container">
      <h2 class="table-header">Supply Inventory</h2>
      
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p class="loading-text">Loading supplies...</p>
      </div>
      
      <div v-else-if="supplies.length === 0" class="empty-state">
        No supplies found. Add a new supply using the form above.
      </div>
      
      <div v-else class="table-wrapper">
        <table class="table">
          <thead class="table-head">
            <tr>
              <th class="table-header-cell">Item Name</th>
              <th class="table-header-cell">Quantity</th>
              <th class="table-header-cell">Category</th>
              <th class="table-header-cell">Supplier</th>
              <th class="table-header-cell">Location</th>
              <th class="table-header-cell">Cost</th>
              <th class="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr v-for="supply in supplies" :key="supply._id" class="table-row">
              <td class="table-cell">
                <div class="item-name">{{ supply.name }}</div>
                <div class="item-description">{{ supply.description }}</div>
              </td>
              <td class="table-cell">
                <div>{{ supply.qty }} {{ supply.unit }}</div>
              </td>
              <td class="table-cell">{{ supply.category }}</td>
              <td class="table-cell">{{ supply.supplier }}</td>
              <td class="table-cell">{{ supply.location }}</td>
              <td class="table-cell">${{ supply.cost.toFixed(2) }}</td>
              <td class="table-cell">
                <div class="action-buttons">
                  <button @click="handleEdit(supply)" class="action-button edit-button">
                    Edit
                  </button>
                  <button @click="handleDelete(supply._id)" class="action-button delete-button">
                    Delete
                  </button>
                  <button @click="openTransactionModal(supply, 'use')" class="action-button use-button">
                    Use
                  </button>
                  <button @click="openTransactionModal(supply, 'restock')" class="action-button restock-button">
                    Restock
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Transaction Modal -->
    <div v-if="showTransactionModal" class="modal-overlay">
      <div class="modal">
        <h3 class="modal-title">
          {{ transactionMode === 'use' ? 'Use' : 'Restock' }} Supply: {{ selectedSupply?.name }}
        </h3>
        
        <form @submit.prevent="handleTransaction">
          <div class="modal-form-group">
            <label class="form-label" for="transactionQty">Quantity</label>
            <input 
              type="number" 
              id="transactionQty" 
              v-model="transactionQty" 
              class="form-input" 
              min="1" 
              required
            />
            <div class="current-quantity">
              Current quantity: {{ selectedSupply?.qty }} {{ selectedSupply?.unit }}
            </div>
          </div>
          
          <div class="modal-actions">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showTransactionModal = false"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn" 
              :class="transactionMode === 'use' ? 'btn-warning' : 'btn-success'"
            >
              {{ transactionMode === 'use' ? 'Use Items' : 'Restock Items' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';

interface Supply {
  _id: string;
  name: string;
  qty: number;
  unit: string;
  description: string;
  category: string;
  supplier: string;
  cost: number;
  location: string;
  lastRestocked?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Constants
const BASE_URL = 'http://localhost:3000';

// State variables
const supplies = ref<Supply[]>([]);
const loading = ref(true);
const isEditing = ref(false);
const currentId = ref<string | null>(null);
const alertMessage = ref<string | null>(null);
const alertType = ref<'success' | 'error'>('success');
const transactionMode = ref<'use' | 'restock'>('use');
const showTransactionModal = ref(false);
const selectedSupply = ref<Supply | null>(null);
const transactionQty = ref(1);

const formData = reactive({
  name: '',
  qty: 0,
  unit: '',
  description: '',
  category: '',
  supplier: '',
  cost: 0,
  location: ''
});

// Methods
const fetchSupplies = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${BASE_URL}/supply`);
    const data = await response.json();
    supplies.value = data;
  } catch (error) {
    showAlert('Failed to fetch supplies', 'error');
    console.error('Error fetching supplies:', error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    let response;
    
    if (isEditing.value && currentId.value) {
      // Update existing supply
      response = await fetch(`${BASE_URL}/supply/${currentId.value}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
    } else {
      // Create new supply
      response = await fetch(`${BASE_URL}/supply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
    }
    
    if (!response.ok) {
      throw new Error('Failed to save supply');
    }
    
    const responseData = await response.json();
    
    // Update local state
    if (isEditing.value) {
      const index = supplies.value.findIndex(s => s._id === currentId.value);
      if (index !== -1) {
        supplies.value[index] = responseData;
      }
      showAlert('Supply updated successfully', 'success');
    } else {
      supplies.value.push(responseData);
      showAlert('Supply added successfully', 'success');
    }
    
    // Reset form
    resetForm();
  } catch (error) {
    showAlert('Error saving supply', 'error');
    console.error('Error:', error);
  }
};

const handleEdit = (supply: Supply) => {
  isEditing.value = true;
  currentId.value = supply._id;
  
  // Populate form with selected supply
  formData.name = supply.name;
  formData.qty = supply.qty;
  formData.unit = supply.unit;
  formData.description = supply.description;
  formData.category = supply.category;
  formData.supplier = supply.supplier;
  formData.cost = supply.cost;
  formData.location = supply.location;
  
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this supply?')) {
    try {
      const response = await fetch(`${BASE_URL}/supply/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete supply');
      }
      
      // Remove from local state
      supplies.value = supplies.value.filter(s => s._id !== id);
      showAlert('Supply deleted successfully', 'success');
    } catch (error) {
      showAlert('Error deleting supply', 'error');
      console.error('Error:', error);
    }
  }
};

const openTransactionModal = (supply: Supply, mode: 'use' | 'restock') => {
  selectedSupply.value = supply;
  transactionMode.value = mode;
  transactionQty.value = 1;
  showTransactionModal.value = true;
};

const handleTransaction = async () => {
  if (!selectedSupply.value) return;
  
  try {
    const endpoint = transactionMode.value === 'use' 
      ? `${BASE_URL}/transaction/use/${selectedSupply.value._id}`
      : `${BASE_URL}/transaction/restock/${selectedSupply.value._id}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ qty: transactionQty.value })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Transaction failed');
    }
    
    const data = await response.json();
    
    // Update local state
    const supplyIndex = supplies.value.findIndex(s => s._id === selectedSupply.value?._id);
    if (supplyIndex !== -1) {
      supplies.value[supplyIndex].qty = data.data.currentQty;
    }
    
    showTransactionModal.value = false;
    showAlert(
      `Successfully ${transactionMode.value === 'use' ? 'used' : 'restocked'} ${transactionQty.value} ${selectedSupply.value.unit} of ${selectedSupply.value.name}`,
      'success'
    );
  } catch (error) {
    if (error instanceof Error) {
      showAlert(error.message, 'error');
    } else {
      showAlert('An unknown error occurred', 'error');
    }
    console.error('Transaction error:', error);
  }
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  isEditing.value = false;
  currentId.value = null;
  formData.name = '';
  formData.qty = 0;
  formData.unit = '';
  formData.description = '';
  formData.category = '';
  formData.supplier = '';
  formData.cost = 0;
  formData.location = '';
};

const showAlert = (message: string, type: 'success' | 'error') => {
  alertMessage.value = message;
  alertType.value = type;
  
  // Auto dismiss after 5 seconds
  setTimeout(() => {
    alertMessage.value = null;
  }, 5000);
};

// Lifecycle hooks
onMounted(() => {
  fetchSupplies();
});
</script>