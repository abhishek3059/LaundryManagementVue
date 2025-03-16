<template>
    <nav
      class="navbar navbar-expand-lg navbar-dark fixed-top bg-dark w-100"
      :style="styles"
    >
      <div class="container-fluid">
        <!-- Brand -->
        <router-link class="navbar-brand" to="/">
          {{ brand }}
        </router-link>
  
        <!-- Toggle button for mobile -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <!-- Navbar links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li
              v-for="(link, index) in links"
              :key="index"
              class="nav-item"
            >
              <router-link class="nav-link" :to="link.path">
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
    props: {
      brand: {
        type: String,
        required: true,
      },
      links: {
        type: Array,
        required: true,
        validator: (value) => {
          return value.every((link) => {
            return (
              typeof link.name === 'string' && typeof link.path === 'string'
            );
          });
        },
      },
      styles: {
        type: Object,
        default: () => ({}),
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>