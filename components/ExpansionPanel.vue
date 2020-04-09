<template>
  <div
    v-bind:aria-expanded="isExpanded"
    class="v-expansion-panel"
    v-bind:class="{ 'v-expansion-panel--active v-item--active': isExpanded }"
    style=""
  >
    <button
      type="button"
      class="v-expansion-panel-header"
      v-bind:class="{ 'v-expansion-panel-header--active': isExpanded }"
      v-on:click="toggle"
    >
      {{ title }}
      <div class="v-expansion-panel-header__icon">
        <i aria-hidden="true" class="v-icon notranslate mdi mdi-chevron-down theme--light"></i>
      </div>
    </button>
    <div
      class="v-expansion-panel-content"
      v-bind:style="isExpanded ? '' : 'display: none'"
    >
      <div class="v-expansion-panel-content__wrap">
        <slot />
      </div>
    </div>
    <v-expansion-panels v-if="false" />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
  data() {
    return {
      isExpanded: false,
    };
  },
  methods: {
    toggle(event) {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>

<style scoped>

</style>
