<template>
  <div class="container mt-5">
    <h2 class="mb-4">Create New Order</h2>
    <form @submit.prevent="submitOrder">
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
          <div class="col-md-3">
            <label class="form-label">Service</label>
            <select v-model="item.serviceId" class="form-select" required>
              <option
                v-for="service in services"
                :key="service.id"
                :value="service.id"
              >
                {{ service.serviceName }}
              </option>
            </select>
          </div>
          <div class="col-12">
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="removeItem(index)"
            >
              - Remove Item
            </button>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" @click="addItem">
        + Add Item
      </button>

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
        <!-- <div class="row g-3">
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
          </div> -->
        <PaymentForm @payment-submit="handlePaymentSubmit" />
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
import jwtDecoder from "@/utils/jwtDecoder";
import { toast } from "vue3-toastify";
import TimeSlotPicker from "@/components/TimeSlots.vue";
import PaymentForm from "@/components/PaymentForm.vue";
import api from "@/utils/api";

export default {
  components: {
    TimeSlotPicker,
    PaymentForm,
  },
  async mounted() {
    await this.loadServices();
  },
  data() {
    return {
      customerId: null,
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
        paymentDetails: "",
      },
      isProcessing: false,
      services: [],
    };
  },
  computed: {
    ...mapState("services", ["currentService", "services"]),
  },
  methods: {
    ...mapActions("order", ["createOrder"]),
    ...mapActions("services", ["fetchServices"]),
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
    addItem() {
      this.items.push({
        serviceId: null,
        quantity: 1,
        itemDescription: "",
        color: "",
        fabric: "",
        specialNotes: "",
      });
    },
    removeItem(index) {
      this.items.splice(index, 1);
    },
    async loadServices() {
      try {
        this.services = await this.fetchServices();
      } catch (error) {
        toast.error("cannot fetch services, something went wrong");
      }
    },

    async submitOrder() {
      if (!this.validateForm()) return;
      this.isProcessing = true;
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          toast.error("user is not authenticated, please log in");
          this.isProcessing = false;
        }
        try {
          const decodedToken = jwtDecoder(token);
          const customerId = decodedToken.userId;
          const username = decodedToken.username;
          if (!customerId || !username) {
            toast.error("Something went wrong, please log in again");
          }
          const pickupSlot = await this.fetchTimeSlots(
            this.orderData.pickupSlotId
          );
          const deliverySlot = await this.fetchTimeSlots(
            this.orderData.deliverySlotId
          );
          console.log("Pickup slot" + pickupSlot);
          console.log("delivery slot" + deliverySlot);
          if (!pickupSlot || !deliverySlot) {
            toast.error("Slots cannot be retrieved try another slots");
            this.isProcessing = false;
            throw new Error("Slots cannot be fetched");
          }
          const orderPayload = {
            customerId: customerId,
            items: this.items.map((item) => ({
              ...item,
              serviceId: this.currentService?.id || null,
              itemDescription: item.itemDescription || "",
              quantity: item.quantity || 1,
              color: item.color || "",
              fabric: item.fabric || "",
              specialNotes: item.specialNotes || "",
            })),
            pickupSlot: pickupSlot,
            deliverySlot: deliverySlot,
            specialInstructions: this.orderData.specialInstructions,
            processingDate: new Date().toISOString().slice(0, 10),
            paymentMethod: this.orderData.paymentMethod,
            paymentDetails: this.orderData.paymentDetails || "",
          };
          await new Promise((resolve) => setTimeout(resolve, 1500));
          console.log("before api call");
          const response = await this.createOrder(orderPayload);
          console.log(response);
          console.log(response.status);

          if (response) {
            this.$router.push({
              path: `/order-success/${username}`,
            });
          }
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          toast.error("Invalid token. Please log in again.");
          // localStorage.removeItem("jwtToken"); // Clear the token
          // this.$router.push("/login");
          this.isProcessing = false;
          return;
        }
      } catch (error) {
        this.handleSubmissionError(error);
      } finally {
        this.isProcessing = false;
      }
    },
    handlePaymentSubmit(paymentData) {
      this.orderData.paymentMethod = paymentData.method;
      this.orderData.paymentDetails = paymentData.details;
    },
    async fetchTimeSlots(slotId) {
      try {
        const response = await api.post(
          `/timeslots/get-slot?timeSlotId=${slotId}`
        );
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        toast.error("cannot fetch slots please try again");
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
