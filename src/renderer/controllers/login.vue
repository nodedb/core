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
  /**
   * login
   */

  /* Node modules */

  /* Third-party modules */
  import { validators } from 'vue-form-generator';

  /* Files */
  import Driver from '../lib/driver';

//  const drivers = Driver.load()
//    .sort();

  export default {
    data () {
//      const values = drivers.drivers.map(({ name, type }) => ({
//        id: type,
//        name,
//      }));

      const values = [];

      const form = {
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },
        model: {
//          driver: values[0].id,
        },
        schema: {
          fields: [{
            type: 'select',
            label: 'driver',
            model: 'driver',
            values,
            required: true,
            validator: [
              validators.required,
            ],
            selectOptions: {
              hideNoneSelectedText: true,
            },
          }],
        },
      };

      /* Add in all the fields for the different databases */

      /* Finally, add in the submit button */
      form.schema.fields.push({
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
      });

      return form;
    },
  };
</script>
