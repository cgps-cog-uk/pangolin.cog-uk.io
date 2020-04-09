<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    width="290px"
  >
    <template v-slot:activator="{}">
      <v-text-field
        v-bind:error-messages="errorMessages"
        append-icon="mdi-camera"
        dense
        v-bind:hide-details="inline ? true : false"
        v-bind:hint="inline ? undefined : description"
        v-bind:label="label"
        v-bind:name="name"
        outlined
        persistent-hint
        v-bind:required="required"
        v-bind:rules="rules"
        v-bind:value="value"
        v-on:click:append="modal = true"
      />
    </template>

    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        Scan Barcode
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="!!error"
          type="error"
        >
          {{ error }}
        </v-alert>
        <client-only v-else>
          <qrcode-stream
            v-on:decode="onDecode"
            v-on:init="onInit"
          />
        </client-only>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          v-on:click="modal = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    description: String,
    errorMessages: null,
    inline: Boolean,
    label: String,
    name: String,
    required: Boolean,
    rules: Array,
    value: String,
  },
  data() {
    return {
      modal: false,
      error: null,
      QrcodeStream: null,
    };
  },
  methods: {
    onDecode(result) {
      this.$emit("input", result);
      this.modal = false;
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        console.error(error);
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        }
        else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        }
        else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        }
        else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        }
        else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        }
        else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
        else {
          this.error = error.name;
        }
      }
    },
  },
};
</script>
