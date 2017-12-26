<template lang="jade">
  div
    div(
      v-for="item in form"
    )
      v-text-field(
        v-if="isTextField(item.type)",
        :label="$t('connection:' + item.label)",
        :prepend-icon="item.prependIcon",
        :append-icon="item.type === 'password' ? (visible[item.key] ? 'visibility_off' : 'visibility') : item.appendIcon",
        :append-icon-cb="item.type === 'password' ? (() => visible[item.key] = !visible[item.key]) : item.append-icon-cb",
        :suffix="item.suffix",
        :prefix="item.prefix",
        :type="item.type === 'password' ? (visible[item.key] ? 'text' : 'password') : item.type"
        v-model="input[item.key]"
      )
</template>

<script>
  /**
   * login
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {

    name: 'login',

    data () {
      return {
        types: {
          text: [
            'text',
            'password',
            'number',
          ],
        },
        visible: this.form.reduce((result, item) => {
          if (item.type === 'password') {
            result[item.key] = false;
          }
          return result;
        }, {}),
      };
    },

    methods: {
      isTextField (type) {
        return this.types.text.includes(type);
      },
    },

    props: {
      form: {
        required: true,
        type: Array,
      },

      input: {
        required: true,
        type: Object,
      },
    },

  };
</script>
