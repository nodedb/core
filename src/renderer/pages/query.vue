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
        id: null,
      };
    },

    methods: {
      fetchData () {
        this.id = this.$route.params.id;
      },
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
