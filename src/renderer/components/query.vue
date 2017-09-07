<template lang="jade">
  div.full_height
    .query_wrapper

      textarea {{ query }}

      .query_input

      button.query_submit(
        @click="submit"
      ) ok

    .result_wrapper result
</template>

<script>
  /**
   * query
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */
  import store from '../store';

  export default {

    created () {
      return this.fetchData();
    },

    data: () => ({
      connection: null,
      query: '',
    }),

    methods: {

      fetchData () {
        this.connection = this.$route.meta.connection;
      },

      submit () {
        const db = store.getters.getActiveDb(this.$route.path);

        return this.connection.query(db, this.query)
          .then((result) => {
            console.log('result');
            console.log(result);
          })
          .catch((err) => {
            console.log('err');
            console.log(err.message);
          });
      },

    },

    mounted () {
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
