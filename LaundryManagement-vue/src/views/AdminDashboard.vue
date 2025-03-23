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

    <table class="table table-hover" v-if="!loading">
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
          <td>{{ order.customer.username }}</td>
          <td>
            <select v-model="order.orderStatus" @change="updateOrder(order)">
              <option
                v-for="status in availableStatuses(order.orderStatus)"
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
    <div v-else class="text-center">Loading...</div>
    <div v-if="error" class="text-danger text-center">{{ error }}</div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import { mapActions } from "vuex";

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
      loading: false,
      error: null,
    };
  },
  async mounted() {
    await this.fetchOrders();
  },
  computed: {
    filteredOrders() {
      if (this.selectedStatus === "ALL") return this.orders;
      return this.orders.filter((o) => o.orderStatus === this.selectedStatus);
    },
  },
  methods: {
    ...mapActions("order", ["fetchOrdersFromBackend", "updateOrderStatus"]),
    formatStatus(status) {
      return status.charAt(0) + status.slice(1).toLowerCase();
    },
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        await this.fetchOrdersFromBackend();
        this.orders = this.$store.getters["order/ordersList"];
        console.log(this.orders);
      } catch (error) {
        this.error = "Failed to fetch orders.";
        toast.error("Error fetching orders");
      } finally {
        this.loading = false;
      }
    },
    async updateOrder(order) {
      console.log("order : in update order \n" + order);
      try {
        console.log("inside admin dashboard update status call");
        await this.updateOrderStatus();
        await this.fetchOrders();
        toast.success("Status updated successfully");
      } catch (error) {
        toast.error("Error updating status");
      }
    },
    viewDetails(order) {
      //implementation for viewDetails.
    },
    availableStatuses(currentStatus) {
      const currIndex = this.orderStatuses.indexOf(currentStatus);
      if (currIndex === -1 || currIndex === this.orders.length - 1) {
        return [];
      }
      return [this.orderStatuses[currIndex + 1]];
    },
  },
};
</script>
