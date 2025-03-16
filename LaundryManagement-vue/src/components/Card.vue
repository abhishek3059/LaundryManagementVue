<template>
  <div class="card" :class="additionalClass" style="width: 18rem">
    <img
      v-if="image"
      :src="image"
      class="card-img-top"
      :alt="title"
      :class="additionalImageCss"
    />
    <div class="card-body" :class="additionalCardBodyCss">
      <h5 class="card-title" :class="additionalCardTitleCss">{{ title }}</h5>
      <p class="card-text" :class="additionalCardTextCss">{{ cardText }}</p>
      <a v-if="cardLink" :href="cardLink" :class="`btn btn-${buttonColor}`">
        {{ buttonText }}
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: "Card",
  props: {
    additionalClass: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    cardText: {
      type: String,
      required: true,
    },
    cardLink: {
      type: String,
      default: "",
    },
    buttonColor: {
      type: String,
      required: true,
    },
    additionalCardBodyCss: {
      type: String,
      default: "",
    },
    additionalImageCss: {
      type: String,
      default: "",
    },
    additionalCardTextCss: {
      type: String,
      default: "",
    },
    additionalCardTitleCss: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      required: true,
    },
  },
};
</script>
