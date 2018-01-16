<template lang="jade">
  div
    div(
      v-for="item in form"
    )
      v-text-field(
        v-if="isTextField(item.type)",
        :label="$t('connection:' + item.label)",
        :prepend-icon="item.prependIcon",
        :append-icon="item.type === 'password' ? (visible[item.key] ? 'mdi-eye' : 'mdi-eye-off') : item.appendIcon",
        :append-icon-cb="item.type === 'password' ? (() => visible[item.key] = !visible[item.key]) : item.append-icon-cb",
        :suffix="item.suffix",
        :prefix="item.prefix",
        :type="item.type === 'password' ? (visible[item.key] ? 'text' : 'password') : item.type",
        :required="item.required === true",
        :rules="getRules(item)",
        @keyup.enter="enter",
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
        rules: {
          required: item => value => !!value || this.$i18n.t('rules:REQUIRED', {
            name: this.$i18n.t(`connection:${item.label}`),
          }),
        },
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
      getRules (item) {
        const rules = [];

        if (item.required === true) {
          rules.push(this.rules.required(item));
        }

        return rules;
      },

      isTextField (type) {
        return this.types.text.includes(type);
      },
    },

    props: {
      enter: {
        required: true,
        type: Function,
      },

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
