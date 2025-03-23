<template>
  <div class="row px-5 mx-4 d-flex">
    <div v-if="orders && orders.length > 0" class="row px-2 mx-2 d-flex">
      <div v-for="order in orders" :key="order.orderId" class="col-md-6 mt-5">
        <div class="card border-black mb-3" style="max-width: 18rem">
          <div class="card-header bg-transparent border-success">
            Order Number : {{ order.orderNumber }}
          </div>
          <div class="card-body text-black">
            <h5 class="card-title">Order Details</h5>

            <p class="card-text">Number of items : {{ order.items.length }}</p>
            <p class="card-text">
              Date : {{ parseDateTime(order.orderDateTime).parsedDate }}
            </p>
            <p class="card-text">
              Time :
              {{ parseDateTime(order.orderDateTime).timeWithRemovedMiliSecond }}
            </p>
            <p class="card-text">Pickup Date : {{ order.pickupSlot.date }}</p>
            <p v-if="order.pickupTime" class="card-text">
              {{ order.pickupTime }}
            </p>
            <p v-if="order.deliveryTime" class="card-text">
              {{ order.deliveryTime }}
            </p>
            <p v-if="order.processingStartTime" class="card-text">
              {{ order.processingStartTime }}
            </p>
            <p v-if="order.processingEndTime" class="card-text">
              {{ order.processingEndTime }}
            </p>
          </div>
          <div
            class="card-footer bg-transparent border-success d-inline-flex flex-column justify-content-evenly"
          >
            <div class="pb-3 pt-1">Total Price : {{ order.totalPrice }}</div>

            <!-- <div class="d-inline-flex justify-content-end px-3"> -->
            <button
              v-if="decodedToken.roles.includes('ROLE_ADMIN')"
              class="btn btn-success"
            >
              update status
            </button>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/utils/api";
import jwtDecoder from "@/utils/jwtDecoder";
import { ref } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";

export default {
  setup() {
    const route = useRoute();
    const orders = ref([]);
    const username = route.params.username;
    console.log(username);
    const token = localStorage.getItem("jwtToken");
    let decodedToken = null;
    try {
      decodedToken = jwtDecoder(token);
    } catch (error) {
      toast.error("Token cannot be decoded");
    }

    onMounted(async () => {
      try {
        const response = await api.get(`/orders/customer/${username}`);
        if (response.status === 200) {
          console.log("inside response");
          orders.value = response.data;
        }
      } catch (error) {
        toast.error("Cannot fetch orders");
      }
    });

    return { orders, decodedToken };
  },
  methods: {
    parseDateTime(date) {
      if (!date) {
        return { parsedDate: "", timeWithRemovedMiliSecond: "" };
      }
      const dateArray = date.split("T");
      let timeWithMiliSecond = null; // Use let
      let parsedDate = null; // Use let
      if (Array.isArray(dateArray) && dateArray.length === 2) {
        parsedDate = dateArray[0];
        timeWithMiliSecond = dateArray[1];
        const timeWithRemovedMiliSecondArray = timeWithMiliSecond.split(".");
        const timeWithRemovedMiliSecond = timeWithRemovedMiliSecondArray[0];
        return {
          parsedDate,
          timeWithRemovedMiliSecond,
        };
      } else {
        return { parsedDate: date, timeWithRemovedMiliSecond: "" };
      }
    },
  },
};
</script>
