<template>
  <section class="vh-100">
    <div class="container-fluid h-custom mb-5">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-md-9 col-lg-6 col-xl-5">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            class="img-fluid"
            alt="Sample image"
          />
        </div>
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <form @submit.prevent="handleSubmit">
            <div
              class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start"
            >
              <p class="lead fw-normal mb-0 me-3">Sign in with</p>
              <button type="button" class="btn btn-primary btn-floating mx-1">
                <i class="fab fa-facebook-f"></i>
              </button>
              <button type="button" class="btn btn-primary btn-floating mx-1">
                <i class="fab fa-twitter"></i>
              </button>
              <button type="button" class="btn btn-primary btn-floating mx-1">
                <i class="fab fa-linkedin-in"></i>
              </button>
            </div>
            <div class="divider d-flex align-items-center my-4">
              <p class="text-center fw-bold mx-3 mb-0">Or</p>
            </div>
            <div class="form-outline mb-4">
              <input
                type="text"
                id="form3Example3"
                class="form-control form-control-lg"
                placeholder="Enter a valid username"
                v-model="username"
              />
              <label class="form-label" for="form3Example3">Username</label>
            </div>
            <div class="form-outline mb-3">
              <input
                type="password"
                id="form3Example4"
                class="form-control form-control-lg"
                placeholder="Enter password"
                v-model="password"
              />
              <label class="form-label" for="form3Example4">Password</label>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <a href="#!" class="text-body">Forgot password?</a>
            </div>
            <div class="text-center text-lg-start mt-4 pt-2">
              <button type="submit" class="btn btn-primary btn-lg">
                Login
              </button>
              <p class="small fw-bold mt-2 pt-1 mb-0">
                Don't have an account?
                <a href="/register" class="link-danger">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    ...mapActions("auth", ["login"]), // Use "auth" namespace explicitly
    async handleSubmit() {
      try {
        const response = await this.login({
          username: this.username,
          password: this.password,
        });
        if (response) {
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  },
};
</script>
