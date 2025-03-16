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
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/navbar.vue";
import Card from "@/components/Card.vue";

import { toast } from "vue3-toastify";
import { onMounted } from "vue";

export default {
  components: {
    Navbar,
    Card,
  },
  setup() {
    onMounted(() => {
      toast.info("Welcome to Laundry Management Services");
    });
  },
  data() {
    return {
      navbarLinks: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Report", path: "/reports" },
        { name: "Support", path: "support" },
      ],
    };
  },
};
</script>
