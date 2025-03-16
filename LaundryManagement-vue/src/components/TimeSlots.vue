<template>
  <div class="time-slot-picker">
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Pickup Date</label>
        <input
          v-model="selectedDate"
          type="date"
          class="form-control"
          :min="minDate"
          @change="fetchAvailableSlots"
        />
      </div>
      <div class="col-md-6">
        <label class="form-label">{{ label }}</label>
        <select
          v-model="selectedSlot"
          class="form-select"
          :disabled="!slots.length"
        >
          <option v-for="slot in slots" :key="slot.slotId" :value="slot">
            {{ formatSlotTime(slot.startTime) }} -
            {{ formatSlotTime(slot.endTime) }}
            ({{ slot.available ? "Available" : "Full" }})
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";
import { mapState } from "vuex";

export default {
  props: {
    label: { type: String, default: "Select Time Slot" },
    slotType: { type: String, required: true },
  },
  data() {
    return {
      selectedDate: "",
      selectedSlot: null,
      slots: [],
      loading: false,
    };
  },
  computed: {
    ...mapState(["currentOrder"]),
    minDate() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
  },
  methods: {
    formatSlotTime(timeString) {
      try {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":").slice(0, 2);
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${period}`;
      } catch (error) {
        console.error("Error formatting time:", error);
        return "Invalid Time";
      }
    },

    async fetchAvailableSlots() {
      if (!this.selectedDate) return;

      this.loading = true;
      try {
        const [year, month, day] = this.selectedDate.split("-");
        const formattedDate = `${day}-${month}-${year}`;

        const response = await api.get("/timeslots", {
          params: {
            day: formattedDate,
            type: this.slotType,
          },
        });

        // Filter and sort slots client-side if needed
        this.slots = response.data
          .filter((slot) => slot.available)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
      } catch (error) {
        console.error("Slot fetch error:", {
          error: error.response?.data,
          config: error.config,
        });
        this.$toast.error(
          error.response?.data?.message || "Failed to load slots"
        );
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    selectedSlot(newVal) {
      if (newVal) {
        this.$emit("slot-selected", {
          type: this.slotType,
          slot: {
            slotId: newVal.slotId,
            startTime: newVal.startTime,
            endTime: newVal.endTime,
          },
        });
      }
    },
  },
};
</script>

<style scoped>
.time-slot-picker {
  margin-bottom: 1.5rem;
}
.form-control[type="date"] {
  cursor: pointer;
}
select.form-select:disabled {
  background-color: #f8f9fa;
  opacity: 1;
}
</style>
