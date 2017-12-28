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

    data () {
      return {
        id: this.$route.params.id,
      };
    },

  };
</script>
