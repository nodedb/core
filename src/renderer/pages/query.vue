<template lang="jade">
  div hello herehrererhereheoh ewrjh eowurh e
</template>

<script>
  /**
   * query
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */
  import sidebar from '../components/sidebar.vue';

  export default {

    components: {
      sidebar,
    },

    data () {
      return {
        id: this.$route.params.id,
      };
    },

  };
</script>
