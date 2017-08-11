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
          select(
            v-model="model.driver"
          )
            option(
              v-for="driver in driverList"
              v-bind:value="driver.type"
            ) {{ driver.name }}

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
        driverList: [],
        loading: true,
        model: {
          driver: '',
        },
      };
    },

    methods: {
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
        console.log(this.model);
      }
    },

    watch: {
      $route: 'loadDrivers',
    },

  };
</script>
