<template lang="jade">
  div.full_height
    .query_wrapper

      vue-editor(
        :cursor.sync="cursor",
        :lang="lang",
        v-model="query",
      )

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
      cursor: null,
      lang: null,
      query: null,
    }),

    methods: {

      fetchData () {
        this.connection = this.$route.meta.connection;
        this.cursor = store.getters.getDbSession(this.$route.path, 'cursor');
        this.lang = this.connection.lang;
        this.query = store.getters.getDbSession(this.$route.path, 'query') || '';
      },

      saveCursor () {
        store.commit('saveDbSession', {
          id: this.$route.path,
          key: 'cursor',
          value: this.cursor,
        });
      },

      saveQuery () {
        store.commit('saveDbSession', {
          id: this.$route.path,
          key: 'query',
          value: this.query,
        });
      },

      submit () {
        const db = store.getters.getDbSession(this.$route.path, 'activeDb');

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

    watch: {
      $route: 'fetchData',
      cursor: 'saveCursor',
      query: 'saveQuery',
    },

  };
</script>
