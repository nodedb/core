<template lang="jade">
  layout-login

    form(
      v-on:submit="submit"
    )
      select(
        v-model="model.driver"
      )
        option(
          v-for="driver in driverList"
          v-bind:value="driver.type"
        ) {{ driver.name }}

      button(
        type="submit"
      ) login

    pre {{ model }}

</template>

<script>
  /**
   * login
   */

  /* Node modules */

  /* Third-party modules */
  import { _ } from 'lodash';

  /* Files */

  export default {
    data () {
      const driverList = [{
        name: 'MySQL',
        type: 'sql-mysql',
      }, {
        name: 'PostgreSQL',
        type: 'sql-pg',
      }];

      let driver = _.first(driverList);
      driver = _.has(driver, 'type') ? driver.type : '';

      return {
        driverList,
        model: {
          driver,
        },
      };
    },
    methods: {
      submit () {
        console.log(this.model);
      }
    }
  };
</script>
