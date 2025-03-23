<template>
  <div class="container-fluid">
    <div class="card shadow-lg p-4 bg-secondary" id="card">
      <div class="card-body text-start">
        <h2 class="card-title text-center text-white mb-4">Register</h2>
        <form>
          <!-- Form fields here -->
          <div class="form-floating mb-4">
            <input
              type="text"
              class="form-control"
              id="username"
              value="usernamed"
              v-model="formData.username"
              placeholder="Enter your username here"
              name="username"
            />
            <label class="form-label p-2">Username</label>
            <div id="usernameHelp" class="form-text text-white">
              <strong>Enter your username here</strong>
            </div>
          </div>
          <div class="form-floating mb-4">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              aria-describedby="emailHelp"
              v-model="formData.email"
              name="email"
            />
            <label class="form-label p-2 text-black">Email address</label>
            <div id="emailHelp" class="form-text text-white">
              <strong>We'll never share your email with anyone else.</strong>
            </div>
          </div>

          <div class="form-floating mb-4">
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="formData.password"
              placeholder="Enter your password here"
              name="password"
            />
            <label class="form-label">Password</label>
            <div id="passwordHelp" class="form-text text-white">
              <strong>We'll never share your password with anyone else.</strong>
            </div>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="phoneNumber"
              v-model="formData.phoneNumber"
              placeholder="Enter your phone number"
              name="phoneNumber"
            />
            <label class="form-label">phone number</label>
            <div id="phoneHelp" class="form-text text-white">
              <strong>Enter your phone number</strong>
            </div>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text-area"
              class="form-control"
              id="address"
              v-model="formData.address"
              placeholder=""
              name="address"
            />
            <label class="form-label p-2">Address</label>
            <div id="addressHelp" class="form-text text-white">
              <strong>Enter your Address</strong>
            </div>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="dateOfBirth"
              v-model="formData.dateOfBirth"
              placeholder="Enter date in the format dd-MM-yyyy"
              name="dateOfBirth"
            />
            <label class="form-label p-2">Date of Birth</label>
            <div id="dateHelp" class="form-text text-white">
              <strong>Enter date in the format dd-MM-yyyy</strong>
            </div>
          </div>
          <div class="mb-3">
            <button
              type="button"
              class="btn btn-primary me-2"
              @click="handleSubmit('ROLE_USER')"
            >
              Register as User
            </button>
            <button
              v-if="isAdmin"
              type="button"
              class="btn btn-secondary me-2"
              @click="handleSubmit('ROLE_ADMIN')"
            >
              Register as Admin
            </button>
            <button
              v-if="isAdmin"
              type="button"
              class="btn btn-danger"
              @click="handleSubmit('ROLE_STAFF')"
            >
              Register as Staff
            </button>
          </div>
        </form>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"; // Import the Role object
import api from "@/utils/api";
import jwtDecoder from "@/utils/jwtDecoder";
import { toast } from "vue3-toastify";

export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
      },
      error: null,
      isAdmin: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.checkAdmin();
  },
  methods: {
    async checkAdmin() {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const decodedToken = jwtDecoder(token);
        console.log(decodedToken);
        if (
          decodedToken &&
          decodedToken.roles &&
          Array.isArray(decodedToken.roles)
        ) {
          this.isAdmin = decodedToken.roles.includes("ROLE_ADMIN");
        } else {
          console.error(
            "Invalid or missing roles in the decoded token:",
            decodedToken
          );
          this.isAdmin = false; // Default to false if roles are missing or invalid
        }
      }
    },
    async handleSubmit(role) {
      const updatedFormData = { ...this.formData, roles: [role] };
      try {
        let response;
        if (role === Role.ROLE_ADMIN) {
          response = await api.post("/admin/create-admin", updatedFormData);
        } else if (role === Role.ROLE_STAFF) {
          response = await api.post("/staff/create-staff", updatedFormData);
        } else {
          response = await api.post("/auth/register", updatedFormData);
        }
        if (response.status === 200) {
          toast.success("New User was successfully saved");
        }
      } catch (error) {
        toast.error("Registration failed. Please try again.");
        this.error = "Registration failed. Please try again.";
      }
    },
  },
};
</script>
