<template lang="jade">
  div hello world {{ id }}
</template>

<script>
  /**
   * query
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */
  export default {

    name: 'query',

    created () {
      this.fetchData();
    },

    data () {
      return {
        connection: undefined,
        id: null,
      };
    },

    methods: {
      fetchData () {
        this.id = this.$route.params.id;
        this.connection = this.$store.getters['connections/getById'](this.id);

        if (!this.connection) {
          /* No connections available - to login page */
          return this.$router.push({
            name: 'login',
          });
        }

        return undefined;
      },
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
