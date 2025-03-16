<template>
  <div class="container mt-5">
    <h2 class="mb-4">Create New Order</h2>
    <form @submit.prevent="submitOrder">
      <!-- Item Details -->
      <div class="mb-4" v-for="(item, index) in items" :key="index">
        <h5>Item {{ index + 1 }}</h5>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Quantity</label>
            <input
              v-model.number="item.quantity"
              type="number"
              class="form-control"
              min="1"
              required
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Item Description</label>
            <input
              v-model="item.itemDescription"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Color</label>
            <input
              v-model="item.color"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Fabric</label>
            <input
              v-model="item.fabric"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-12">
            <label class="form-label">Special Notes</label>
            <textarea
              v-model="item.specialNotes"
              class="form-control"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Time Slot Selection -->
      <div class="mb-4">
        <h4>Select Time Slots</h4>
        <div class="row g-3">
          <div class="col-md-6">
            <TimeSlotPicker
              label="Pickup Slot"
              slot-type="PICKUP"
              @slot-selected="handleSlotSelected"
            />
          </div>
          <div class="col-md-6">
            <TimeSlotPicker
              label="Delivery Slot"
              slot-type="DELIVERY"
              @slot-selected="handleSlotSelected"
            />
          </div>
        </div>
      </div>

      <!-- Payment Section -->
      <div class="mb-4">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Payment Method</label>
            <select
              v-model="orderData.paymentMethod"
              class="form-select"
              required
            >
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-success" :disabled="isProcessing">
        {{ isProcessing ? "Processing..." : "Submit Order" }}
      </button>
    </form>

    <!-- Loading Overlay -->
    <div v-if="isProcessing" class="processing-overlay">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Processing your order...</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { toast } from "vue3-toastify";
import TimeSlotPicker from "@/components/TimeSlots.vue";

export default {
  components: {
    TimeSlotPicker,
  },
  data() {
    return {
      items: [
        {
          serviceId: null,
          quantity: 1,
          itemDescription: "",
          color: "",
          fabric: "",
          specialNotes: "",
        },
      ],
      orderData: {
        pickupSlotId: null,
        deliverySlotId: null,
        specialInstructions: "",
        paymentMethod: "CREDIT_CARD",
      },
      isProcessing: false,
    };
  },
  computed: {
    ...mapState("services", ["currentService"]),
  },
  methods: {
    ...mapActions("order", ["createOrder"]),
    handleSlotSelected({ type, slot }) {
      if (!slot?.slotId) {
        toast.error("Invalid time slot selection");
        return;
      }

      if (type === "PICKUP") {
        this.orderData.pickupSlotId = slot.slotId;
      } else {
        this.orderData.deliverySlotId = slot.slotId;
      }
    },
    async submitOrder() {
      if (!this.validateForm()) return;

      this.isProcessing = true;
      try {
        const orderPayload = {
          ...this.orderData,
          items: this.items.map((item) => ({
            ...item,
            serviceId: this.currentService?.id || null,
            price: this.currentService?.basePrice * item.quantity || 0,
          })),
        };

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const response = await this.createOrder(orderPayload);

        if (response?.orderNumber) {
          this.$router.push({
            path: `/order-success/${response.orderNumber}`,
            query: { total: response.totalPrice },
          });
        }
      } catch (error) {
        this.handleSubmissionError(error);
      } finally {
        this.isProcessing = false;
      }
    },
    validateForm() {
      const errors = [];

      if (!this.currentService?.id) {
        errors.push("Please select a service first");
      }
      if (!this.orderData.pickupSlotId) {
        errors.push("Please select a pickup slot");
      }
      if (!this.orderData.deliverySlotId) {
        errors.push("Please select a delivery slot");
      }
      if (this.items.some((item) => item.quantity < 1)) {
        errors.push("All items must have quantity ≥ 1");
      }
      if (this.items.some((item) => !item.itemDescription.trim())) {
        errors.push("All items require a description");
      }

      if (errors.length > 0) {
        errors.forEach((e) => toast.error(e));
        return false;
      }
      return true;
    },
    handleSubmissionError(error) {
      console.error("Order Error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Order submission failed. Please try again.";
      toast.error(message);
    },
  },
};
</script>

<style scoped>
.processing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.form-control:disabled {
  background-color: #f8f9fa;
  opacity: 1;
}
</style>
