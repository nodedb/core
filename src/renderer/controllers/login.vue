<template lang="jade">
  div
    h1 {{ $t('common:GREETING') }}

    form
      vue-form-generator(
        :schema="schema",
        :model="model",
        :options="formOptions"
      )
</template>

<script>
  import { validators } from 'vue-form-generator';
  import Driver from '../lib/driver';

  const drivers = Driver.load()
    .sort();

  export default {
    data () {
      return {
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },
        model: {
          password: '',
          username: '',
        },
        schema: {
          fields: [{
            type: 'input',
            inputType: 'text',
            label: this.$i18n.i18next.t('form:USERNAME'),
            model: 'username',
            required: true,
            validator: [
              validators.string,
            ]
          }, {
            type: 'input',
            inputType: 'password',
            label: this.$i18n.i18next.t('form:PASSWORD'),
            model: 'password',
            required: true,
            validator: [
              validators.string,
            ]
          }, {
            type: 'button',
            label: this.$i18n.i18next.t('button:LOGIN'),
            model: 'button',
            onSubmit: (model) => {
              console.log({
                model
              });
            },
            styleClass: [
              'btn',
              'btn-primary',
            ],
            validateBeforeSubmit: true,
          }],
        }
      };
    },
  };
</script>
