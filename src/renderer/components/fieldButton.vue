<template lang="jade">
  button(
    :class="schema.styleClass",
    :type="schema.inputType || 'submit'",
    @click="click",
  ) {{ schema.label }}
</template>

<script>
  /**
   * fieldButton
   */

  /* Node modules */

  /* Third-party modules */
  import { abstractField } from 'vue-form-generator';
  import { isFunction } from 'lodash';

  /* Files */

  export default {
    methods: {
      click () {
        if (this.schema.validateBeforeSubmit !== false) {
          if (!this.$parent.validate()) {
            /* Errors present - don't submit */
            return;
          }
        }

        if (isFunction(this.schema.onSubmit)) {
          this.schema.onSubmit(this.model, this.schema);
        }
      },
    },
    mixins: [
      abstractField,
    ],
  };
</script>
