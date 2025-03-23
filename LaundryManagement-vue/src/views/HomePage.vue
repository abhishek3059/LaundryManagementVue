<template>
  <div class="container-fluid">
    <Navbar :brand="'LaundryManagement'" :links="navbarLinks" />
    <div class="container mt-4 pt-5">
      <div class="container bg-success bg-gradient text-white rounded-4 w-55">
        <h1 class="pt-4 pb-4 mb-5 mt-5">Variety Laundry Services</h1>
      </div>
      <div class="container d-flex flex-row justify-content-evenly">
        <Card
          :additionalClass="'pt-5'"
          :cardText="'Login Link For Admin, Staff and User'"
          :title="'Login'"
          :cardLink="'/login'"
          :buttonColor="'success'"
          :cardBodyCss="'text-center'"
          :cardTitleCss="'pb-5 fs-1'"
          :cardTextCss="'fs-9 lh-xs'"
          :buttonText="'Login'"
        />
        <Card
          :additionalClass="'pt-5'"
          :cardText="'Register Link For Admin, Staff and User'"
          :title="'Register'"
          :cardLink="'/register'"
          :buttonColor="'primary'"
          :cardBodyCss="'text-center'"
          :cardTitleCss="'pb-5 fs-1'"
          :cardTextCss="'fs-9 lh-xs'"
          :buttonText="'Register'"
        />
        <Card
          v-if="isAdmin"
          :additionalClass="'pt-5'"
          :cardText="'Admin Controls'"
          :title="'Admin'"
          :cardLink="'/admindashboard'"
          :buttonColor="'warning mt-4'"
          :cardBodyCss="'text-center'"
          :cardTitleCss="'pb-5 fs-1'"
          :cardTextCss="'fs-9 lh-xs'"
          :buttonText="'Admin Control'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/components/navbar.vue";
import Card from "@/components/Card.vue";

import { toast } from "vue3-toastify";
import { onMounted, useTemplateRef } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { ref } from "vue";
import jwtDecoder from "@/utils/jwtDecoder";
import { useRoute } from "vue-router";

const store = useStore();
const token = computed(() => store.state.auth.token);
const isAdmin = ref(false);
const isLoggedIn = computed(() => store.state.auth.isLoggedIn);
const route = useRoute();
onMounted(() => {
  toast.info("Welcome to Laundry Management Services");
  if (token.value) {
    try {
      const decodedToken = jwtDecoder(token.value);
      isAdmin.value = decodedToken.roles.includes("ROLE_ADMIN");
    } catch (error) {
      toast.error("cannot decode token");
      if (!isLoggedIn.value && route.meta.requiresAuth)
        toast.info("Please login again for authentication");
    }
  }
});

const navbarLinks = ref([
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Report", path: "/reports" },
  { name: "Support", path: "support" },
]);
</script>
