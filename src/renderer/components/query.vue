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
  import { _ } from 'lodash';
  import Quill from 'quill';

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

      keyup () {
        console.log('key up');
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
      this.editor = new Quill('.query_input', {
      });

      if (this.editor.container) {
        /* Set the initial query to the editor */
        this.editor.setText(this.query);

        /* Copy to the textarea */
        this.editor.on('text-change', () => {
          this.query = this.editor.getText();
        });
      }
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
