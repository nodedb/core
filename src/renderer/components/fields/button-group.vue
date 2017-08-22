<template lang="jade">
  .btn-group
    button(
      v-for="(button, buttonId) in this.schema.groupButtons",
      @click="click(buttonId)",
      :class="button.styleClass",
      :type="button.type"
    ) {{ button.buttonText }}
</template>

<script>
  /**
   * button-group
   */

  /* Node modules */

  /* Third-party modules */
  import { _ } from 'lodash';
  import { abstractField } from 'vue-form-generator';

  /* Files */

  export default {

    methods: {
      click (id) {
        const button = this.schema.groupButtons[id];

        let err = null;

        switch (button.type) {
          case 'link':
            if (_.isFunction(button.onClick)) {
              button.onClick(this.model, this.schema, button);
            }
            break;

          case 'submit':
            if (button.validateBeforeSubmit === true) {
              if (!this.$parent.validate()) {
                // There are validation errors. Stop the submit
                return;
              }
            }

            if (_.isFunction(button.onSubmit)) {
              button.onSubmit(this.model, this.schema, button);
            }
            break;

          default:
            err = new Error(`Unknown button.type: ${button.type}`);
            break;
        }

        if (err) {
          throw err;
        }
      },
    },

    mixins: [
      abstractField,
    ],

  };
</script>
