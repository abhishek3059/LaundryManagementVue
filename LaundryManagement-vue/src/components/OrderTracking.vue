<template>
  <div class="order-timeline">
    <div
      v-for="order in orderStatus"
      :key="status"
      :class="['status-step', { active: isActive(status) }]"
    >
      <div class="status-indicator"></div>
      <div class="status-label">{{ formatStatus(status) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentStatus: String,
  },
  data() {
    return {
      orderStatus: [
        "PENDING",
        "RECIEVED",
        "PROCESSING",
        "COMPLETED",
        "DELIVERED",
      ],
    };
  },
  methods: {
    isActive(status) {
      return (
        this.orderStatus.indexOf(status) <=
        this.orderStatus.indexof(this.currentStatus)
      );
    },
    formatStatus(status) {
      return status.charAt(0) + status.slice(1).toLowerCase();
    },
  },
};
</script>
<style scoped>
.order-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 2rem 0;
}

.status-step {
  flex: 1;
  text-align: center;
  position: relative;
}

.status-indicator {
  width: 20px;
  height: 20px;
  background: #ddd;
  border-radius: 50%;
  margin: 0 auto 10px;
}

.status-step.active .status-indicator {
  background: #0d6efd;
  border: 3px solid #b8d4fe;
}

.status-label {
  font-size: 0.9rem;
  color: #666;
}

.status-step.active .status-label {
  color: #0d6efd;
  font-weight: bold;
}
</style>
