<template>
  <div class="options">
    <div>
      <h2>COG-UK CLIMB Credentials</h2>
      <p>
        <label for="username">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
        >
      </p>
      <p>
        <label for="token">Token</label>
        <input
          id="token"
          v-model="token"
          type="password"
        >
      </p>
    </div>
    <button
      v-on:click="save"
    >
      Save
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      token: null,
    };
  },
  methods: {
    save() {
      const { username, token } = this;
      this.$store.commit("setOptions", { username, token });
    },
  },
};
</script>

<style scoped>
.options {
  width: 100%;
  padding: 0;
  height: 100%;
  flex-direction: column;
  display: flex;
  border-width: 2px;
  border-style: solid;
  border-radius: .25rem;
  border-color: transparent;
}

h2 {
  padding: 16px;
}

.options > div {
  background-color: #f9f9fa;
  width: 100%;
  margin-bottom: 16px;
  flex-grow: 1;
  text-align: left;
  flex-direction: column;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

p {
  padding: 4px 16px;
  display: flex;
  width: 100%;
  align-items: center;
}

label {
  display: inline-block;
  min-width: 80px;
}

input {
  padding: 4px 8px;
  margin: 4px 0;
  line-height: 1.5;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #d7d7db;
  flex-grow: 1;
}
input:focus {
  border-color:#0060df;
}

button {
  border-style: none;
  background-color: #0060df;
  color:#fff;
  cursor: pointer;
  padding: 1rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  font-family: inherit;
  font-size: 100%;
}
button:focus, button:hover {
  background-color:#003eaa;
}
</style>
