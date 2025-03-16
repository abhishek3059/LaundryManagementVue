<template>
  <div class="container mt-4">
    <h2>Order Management</h2>
    <div class="mb-3">
      <select v-model="selectedStatus" class="form-select">
        <option value="ALL">All Orders</option>
        <option v-for="status in orderStatuses" :value="status" :key="status">
          {{ formatStatus(status) }}
        </option>
      </select>
    </div>

    <table class="table table-hover">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Customer</th>
          <th>Status</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.id">
          <td>{{ order.orderNumber }}</td>
          <td>{{ order.customer.name }}</td>
          <td>
            <select v-model="order.orderStatus" @change="updateStatus(order)">
              <option
                v-for="status in orderStatuses"
                :value="status"
                :key="status"
              >
                {{ formatStatus(status) }}
              </option>
            </select>
          </td>
          <td>₹{{ order.totalPrice }}</td>
          <td>
            <button @click="viewDetails(order)" class="btn btn-sm btn-info">
              Details
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";

export default {
  data() {
    return {
      orders: [],
      selectedStatus: "ALL",
      orderStatuses: [
        "PENDING",
        "RECEIVED",
        "PROCESSING",
        "COMPLETED",
        "DELIVERED",
      ],
    };
  },
  async mounted() {
    this.orders = await this.fetchOrders();
  },
  computed: {
    filteredOrders() {
      if (this.selectedStatus === "ALL") return this.orders;
      return this.orders.filter((o) => o.orderStatus === this.selectedStatus);
    },
  },
  methods: {
    formatStatus(status) {
      return status.charAt(0) + status.slice(1).toLowerCase();
    },
    async updateStatus(order) {
      try {
        await axios.put(`/api/orders/${order.id}/status`, {
          status: order.orderStatus,
        });
        toast.success("Status updated successfully");
      } catch (error) {
        toast.error("Error updating status");
      }
    },
  },
};
</script>
