<template lang="jade">
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
        v-html="$t('error:DB_CONNECTION', { err: connectErr.message })"
      )

      form
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
  import { validators } from 'vue-form-generator';

  /* Files */
  import Driver from '../lib/driver';
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
          validateAfterLoad: false,
          validateAfterChanged: true,
        },
        loading: true,
        model: {
          driver: '',
        },
      };
    },

    methods: {
      cancel () {
        return this.$router.push({
          name: 'query',
          params: {
            connectionId: this.$route.query.active,
          },
        });
      },

      changeForm () {
        /* Load the driver */
        const { driver } = this.driverList.find(({ id }) => this.model.driver === id);
        this.driver = driver;
        const i18n = this.$i18n.i18next;

        const active = this.$route.query.active;

        /* Get the form */
        const fields = [{
          label: i18n.t('connect:DRIVER_TYPE'),
          model: 'driver',
          selectOptions: {
            hideNoneSelectedText: true,
          },
          type: 'select',
          values: this.driverList,
        }, {
          label: i18n.t('connect:CONNECTION_NAME'),
          model: 'name',
          type: 'input',
          required: true,
          validator: [
            validators.string,
          ],
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
        const groupButtons = [{
          buttonText: 'login',
          type: 'submit',
          styleClass: 'btn btn-primary',
          validateBeforeSubmit: true,
          onSubmit: this.submit,
        }];

        /* Do we add in a cancel button */
        if (active) {
          groupButtons.push({
            buttonText: 'cancel',
            styleClass: 'btn btn-default',
            type: 'link',
            onClick: this.cancel,
          });
        }

        fields.push({
          type: 'button-group',
          label: ' ',
          groupButtons,
        });

        this.connectForm = {
          fields,
        };
      },

      loadDrivers () {
        return Driver.getDriverList()
          .then((driverList) => {
            if (driverList.length > 0) {
              this.model.driver = driverList[0].id;
            }

            this.driverList = driverList;
            this.loading = false;
          })
          .catch((err) => {
            // @todo
            console.log(err.stack);
          });
      },

      submit () {
        this.driver.params = this.model;

        return this.driver.connect()
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
          .then(connectionId => this.$router.push({
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
