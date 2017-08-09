<template lang="jade">
  div
    h1 {{ $t('common:GREETING') }}

    div(v-if="loading") loading...
    div(v-else)
      form(v-if="drivers.length > 0")
        vue-form-generator(
          :schema="schema",
          :model="model",
          :options="formOptions"
        )
      div(v-else) no drivers available

</template>

<script>
  /**
   * login
   */

  /* Node modules */

  /* Third-party modules */
  import { _ } from 'lodash';
  import { validators } from 'vue-form-generator';

  /* Files */
  import Driver from '../lib/driver';

  export default {
    created () {
      this.resolve();
    },
    data () {
      return {
        drivers: [],
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },
        loading: false,
        model: {
          driver: '',
        },
        schema: {
          fields: [],
        }
      };
    },
    methods: {
      resolve () {
        this.loading = true;

        return Driver.loadAll()
          .then((drivers) => {
            this.loading = false;

            this.drivers = drivers;

            const values = drivers.map(({ name, type }, key) => {
              if (key === 0) {
                this.model.driver = type;
              }
              return {
                id: type,
                name,
              };
            });

            const fields = [{
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
            }];

            /* Add in all the fields for the different databases */
//            this.drivers.forEach(driver => driver
//              .connectForm()
//              .forEach((item) => {
//                item.model = `${driver.type}_${item.model}`;
//
////                item.visible = model => driver.type === model.driver;
//
//                fields.push(item);
//              }));

            /* Finally, add in the submit button */
            fields.push({
              type: 'button',
              label: this.$i18n.i18next.t('button:LOGIN'),
              model: 'button',
              onSubmit: (model) => {
                const driver = drivers.find(({ type }) => type === model.driver);

                console.log(driver);
              },
              styleClass: [
                'btn',
                'btn-primary',
              ],
              validateBeforeSubmit: true,
            });

            this.schema.fields = fields;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    watch: {
      '$route': 'resolve',
    },
  };

//  const values = drivers.map(({ name, type }) => ({
//    id: type,
//    name,
//  }));
//
//  export default {
//    data () {
//      const fields = [{
//        type: 'select',
//        label: 'driver',
//        model: 'driver',
//        values,
//        required: true,
//        validator: [
//          validators.required,
//        ],
//        selectOptions: {
//          hideNoneSelectedText: true,
//        },
//      }];
//
//      /* Add in all the fields for the different databases */
//      drivers.forEach((driver) => {
//        const form = driver.connectForm()
//          .map(item => {
//            item.model = `${driver.type}_${item.model}`;
//
//            item.visible = (model) => {
//
//            };
//
//            return item;
//          });
//
//        console.log(form);
//      });
//
//      /* Finally, add in the submit button */
//      fields.push({
//        type: 'button',
//        label: this.$i18n.i18next.t('button:LOGIN'),
//        model: 'button',
//        onSubmit: (model) => {
//          const driver = drivers.find(({ type }) => type === model.driver);
//
//          console.log(driver);
//        },
//        styleClass: [
//          'btn',
//          'btn-primary',
//        ],
//        validateBeforeSubmit: true,
//      });
//
//      return {
//        drivers,
//        formOptions: {
//          validateAfterLoad: true,
//          validateAfterChanged: true,
//        },
//        model: {
//          driver: _.has(values, 0) ? values[0].id : '',
//        },
//        schema: {
//          fields,
//        },
//      };
//    },
//  };
</script>
