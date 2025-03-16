<template>
  <div class="container mt-5">
    <h2 class="mb-4">Our Services</h2>
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="service in services" :key="service.id" class="col">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ service.serviceName }}</h5>
            <p class="card-text">{{ service.description }}</p>
            <p class="text-primary">₹{{ service.basePrice }} per item</p>
            <button @click="startNewOrder(service)" class="btn btn-primary">
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      services: [],
    };
  },
  async mounted() {
    await this.loadServices();
  },
  methods: {
    ...mapActions("services", ["fetchServices", "setCurrentService"]),
    async loadServices() {
      try {
        this.services = await this.fetchServices();
      } catch (error) {
        console.error("Error loading services:", error);
      }
    },
    startNewOrder(service) {
      this.setCurrentService(service);
      this.$router.push("/create-order");
    },
  },
};
</script>
