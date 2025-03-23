<template>
  <div class="payment-form">
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Payment Method</label>
        <select
          v-model="paymentMethod"
          class="form-select"
          @change="resetPaymentDetails"
        >
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="DEBIT_CARD">Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="NET_BANKING">Net Banking</option>
        </select>
      </div>

      <div v-if="isCardPayment" class="col-12">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Card Number</label>
            <input
              v-model="paymentDetails.cardNumber"
              class="form-control"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Expiry Date</label>
            <input
              v-model="paymentDetails.expiry"
              class="form-control"
              placeholder="MM/YY"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">CVV</label>
            <input
              v-model="paymentDetails.cvv"
              class="form-control"
              type="password"
              placeholder="***"
            />
          </div>
        </div>
      </div>

      <div v-if="paymentMethod === 'UPI'" class="col-12">
        <label class="form-label">UPI ID</label>
        <input
          v-model="paymentDetails.upi"
          class="form-control"
          placeholder="example@upi"
        />
      </div>

      <div class="col-12">
        <button @click="submitPayment" class="btn btn-primary">
          Process Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentMethod: "CREDIT_CARD",
      paymentDetails: {},
    };
  },
  computed: {
    isCardPayment() {
      return (
        this.paymentMethod === "CREDIT_CARD" ||
        this.paymentMethod === "DEBIT_CARD"
      );
    },
  },
  methods: {
    resetPaymentDetails() {
      this.paymentDetails = {};
    },
    submitPayment() {
      let paymentString = "";
      if (this.isCardPayment) {
        paymentString = `${this.paymentDetails.cardNumber || ""}|${
          this.paymentDetails.expiry || ""
        }|${this.paymentDetails.cvv || ""}`;
      } else if (this.paymentMethod === "UPI") {
        paymentString = this.paymentDetails.upi || "";
      } else {
        paymentString = this.paymentDetails.bankName || "";
      }

      this.$emit("payment-submit", {
        method: this.paymentMethod,
        details: paymentString,
      });
    },
  },
};
</script>
