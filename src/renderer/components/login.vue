<template lang="jade">
  div
    div(
      v-if="loading"
    ) loading...

    div(
      v-else
    )
      layout-login

        form(
          @submit="submit"
        )
          .form-group
            select(
              v-model="model.driver"
            )
              option(
                v-for="driver in driverList"
                v-bind:value="driver.type"
              ) {{ driver.name }}

          .form-group(
            v-for="item in connectForm"
          )
            div {{ item }}

          .form-group
            button login

        pre {{ model }}

</template>

<script>
  /**
   * login
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */
  import Driver from '../lib/driver';

  export default {

    created () {
      this.loadDrivers();
    },

    data () {

      return {
        connectForm: [],
        driver: null,
        driverList: [],
        loading: true,
        model: {
          driver: '',
        },
      };
    },

    methods: {
      changeForm () {
        /* Load the driver */
        const { driver } = this.driverList.find(({ type }) => type === this.model.driver);
        this.driver = driver;

        /* Get the form */
        this.connectForm = this.driver.connectForm;
      },
      loadDrivers () {
        Driver.getDriverList()
          .then((driverList) => {
            this.driverList = driverList;
            if (driverList.length > 0) {
              this.model.driver = driverList[0].type;
            }
            this.loading = false;
          })
          .catch((err) => {
            console.log({
              err
            });
          });
      },
      submit () {
        console.log({
          driver: this.driver,
          model: this.model
        });
      }
    },

    watch: {
      $route: 'loadDrivers',
      'model.driver': 'changeForm',
    },

  };
</script>
