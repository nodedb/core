<template lang="jade">
  div
    div(
      v-if="loading"
    ) loading...

    div(
      v-else
    )
      layout-login

        form(@submit="submit")
          vue-form-generator(
            :model="model",
            :options="formOptions",
            :schema="connectForm",
          )

</template>

<script>
  /**
   * login
   */

  /* Node modules */

  /* Third-party modules */
  import { _ } from 'lodash';

  /* Files */
  import Driver from '../lib/driver';

  export default {

    created () {
      this.loadDrivers();
    },

    data () {
      return {
        connectForm: [],
        connection: {},
        driverList: [],
        driverType: '',
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },
        loading: true,
        model: {
          driver: '',
        },
      };
    },

    methods: {
      changeForm () {
        /* Load the driver */
        const { driver } = this.driverList.find(({ id }) => id === this.model.driver);
        this.driver = driver;
        const i18n = this.$i18n.i18next;

        /* Get the form */
        const fields = [{
          label: i18n.t('connect:DRIVER_TYPE'),
          model: 'driver',
          selectOptions: {
            hideNoneSelectedText: true,
          },
          type: 'select',
          values: this.driverList,
        }]
          .concat(this.driver.connectForm())
          .reduce((result, field) => {
            /* Ensure truthy value */
            if (_.isPlainObject(field)) {
              /* Set any default field */
              if (_.has(field, 'default')) {
                this.model[field.model] = field.default;
              }

              result.push(field);
            }
            return result;
          }, []);

        /* Add login button */
        fields.push({
          buttonText: 'login',
          type: 'submit',
          validateBeforeSubmit: true,
        });

        this.connectForm = {
          fields,
        };
      },
      loadDrivers () {
        Driver.getDriverList()
          .then((driverList) => {
            this.driverList = driverList;
            if (driverList.length > 0) {
              this.model.driver = driverList[0].id;
            }
            this.loading = false;
          })
          .catch((err) => {
            // @todo
            console.log(err.stack);
          });
      },
      submit () {
        return this.driver.connect(this.model)
          .then((...args) => {
            console.log(args);
          });
      },
    },

    watch: {
      $route: 'loadDrivers',
      'model.driver': 'changeForm',
    },

  };
</script>
