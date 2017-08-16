<template lang="jade">
  layout-no-sidebar
    div.login-page
      div(
        v-if="loading"
      )
        img(
          src="assets/img/loading.svg"
          alt="loading..."
        )

      div(
        v-else
      )

        .alert.alert-danger(
          v-if="connectErr"
        ) {{ $t('error:DB_CONNECTION', { err: connectErr.message }) }}

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
  import router from '../lib/router';
  import store from '../store';

  export default {

    created () {
      return this.loadDrivers();
    },

    data () {
      return {
        connectForm: [],
        connection: {},
        driverList: [],
        driverType: '',
        connectErr: null,
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
        return Driver.getDriverList()
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
          .then(() => {
            /* Remove any connection error */
            this.connectErr = null;

            /* Add connection to the state */
            return store.dispatch('saveConnection', {
              id: this.driver.id,
              moduleName: this.driver.module,
              params: this.model,
            });
          })
          .then(connectionId => router.push({
            name: 'query',
            params: {
              connectionId,
            },
          }))
          .catch((err) => {
            /* Failed to connect - show the reason */
            this.connectErr = err;
          });
      },
    },

    watch: {
      $route: 'loadDrivers',
      'model.driver': 'changeForm',
    },

  };
</script>
