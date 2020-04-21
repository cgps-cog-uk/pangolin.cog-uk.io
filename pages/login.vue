<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <section>
              <center>
                <h1>Sign in with</h1>
                <h2>COG-UK CLIMB account</h2>
              </center>
              <v-form v-model="isFormValid">
                <v-text-field
                  v-model="username"
                  label="Username"
                  name="username"
                  outlined
                  required
                  v-bind:rules="usernameRules"
                  type="text"
                />
                <v-text-field
                  v-model="token"
                  label="Token"
                  name="password"
                  outlined
                  required
                  v-bind:rules="tokenRules"
                  type="password"
                />
                <!-- <v-select
                  v-bind:items="[ 'covid.majora.ironowl.it', 'majora.covid19.climb.ac.uk' ]"
                  label="Outlined style"
                  outlined
                /> -->
                <v-btn
                  block
                  color="primary"
                  depressed
                  large
                  type="submit"
                  v-on:click="login"
                >
                  {{ loginLabel }}
                </v-btn>
                <footer>
                  <strong
                    v-show="mode === 'error'"
                  >
                    Invalid credentials
                  </strong>
                </footer>
              </v-form>
              <v-progress-linear
                v-if="mode === 'sending'"
                indeterminate
              />
              <v-overlay
                absolute
                v-bind:value="mode === 'sending'"
              />
            </section>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  layout: "login",
  data() {
    return {
      username: null,
      token: null,
      mode: "input",
      isFormValid: false,
      usernameRules: [
        (v) => !!v || "Username is required",
      ],
      tokenRules: [
        (v) => !!v || "Token is required",
        (v) => (v && v.length === 36) || "Token must be 36 characters long",
        (v) => /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/i.test(v) || "Token must be a valid UUID",
      ],
    };
  },
  computed: {
    loginLabel() {
      if (this.username) {
        if (/^test-/i.test(this.username)) {
          return "Login to TEST server";
        }
        else {
          return "Login to LIVE server";
        }
      }
      else {
        return "Login";
      }
    },
  },
  methods: {
    login($event) {
      $event.preventDefault();
      if (this.isFormValid) {
        this.mode = "sending";
        const data = {
          username: this.username,
          token: this.token,
        };
        this.$auth.loginWith("local", { data })
          .catch((err) => {
            this.mode = "error";
          });
      }
    },
  },
};
</script>

<style scoped>
section {
  position: relative;
  /* min-height: 500px; */
  padding: 48px 40px 0px 40px;
  font-size: 14px;
  line-height: 1.4286;
  border-radius: 8px;
  border: 1px solid #dadce0;
}
.v-form {
  padding: 24px 0 0 0;
}
.v-form footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.v-progress-linear {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.v-btn {
  margin-left: auto;
}

.v-overlay--active >>> .v-overlay__scrim {
  opacity: 0.14 !important;
}
</style>
