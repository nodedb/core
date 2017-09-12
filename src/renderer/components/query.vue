<template lang="jade">
  div.full_height.query_page_wrapper
    .query_wrapper

      nav.navbar.navbar-light.bg-light

        ul.navbar-nav
          li.nav-item
            a.nav-link(
              href="#"
            ) hello

        form.form-inline
          .form-group
            label(
              for="selectedDb"
            ) hello

            select#selectedDb.custom-select(
              v-model="selectedDb"
            )
              option(
                v-for="db in dbList",
                :value="db"
              ) {{ db }}

      vue-editor(
        :cursor.sync="cursor",
        :lang="lang",
        v-model="query",
      )

      button.query_submit(
        @click="submit"
      ) ok

    .result_wrapper
      h2 query

      table.table(
        v-if="fields.length > 0"
      )

        thead
          tr
            th
              .form-check
                input.form-check-input(
                  type="checkbox"
                )

            th(
              v-for="field in fields"
            ) {{ field }}

        tbody
          tr(
            v-for="row in result"
          )
            td
              input.form-check-input(
                type="checkbox"
              )

            td(
              v-for="field in fields"
            ) {{ row[field] }}


</template>

<script>
  /**
   * query
   */

  /* Node modules */

  /* Third-party modules */
  import { _ } from 'lodash';

  /* Files */
  import store from '../store';

  export default {

    created () {
      return this.fetchData();
    },

    data: () => ({
      activeDb: null,
      connection: null,
      cursor: null,
      dbList: [],
      fields: [],
      lang: null,
      query: null,
      result: [],
      selectedDb: null,
    }),

    methods: {

      changeDb () {
        this.selectedDb = this.activeDb;
      },

      fetchData () {
        this.connection = this.$route.meta.connection;
        this.cursor = store.getters.getDbSession(this.$route.path, 'cursor');
        this.lang = this.connection.lang;
        this.query = store.getters.getDbSession(this.$route.path, 'query') || '';
        this.selectedDb = store.getters.getDbSession(this.$route.path, 'activeDb');

        this.connection.dbList()
          .then((dbList) => {
            this.dbList = dbList;

            if (!this.selectedDb) {
              this.selectedDb = _.first(this.dbList);
            }
          });
      },

      saveCursor () {
        store.commit('saveDbSession', {
          id: this.$route.path,
          key: 'cursor',
          value: this.cursor,
        });
      },

      saveDb () {
        store.commit('saveDbSession', {
          id: this.$route.path,
          key: 'activeDb',
          value: this.selectedDb,
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
        return this.connection.query(this.selectedDb, this.query)
          .then(({ fields, result }) => {
            this.fields = fields;
            this.result = result;
          })
          .catch((err) => {
            console.log('err');
            console.log(err.message);
          });
      },

    },

    props: {
      activeDb: String,
    },

    watch: {
      $route: 'fetchData',
      activeDb: 'changeDb',
      cursor: 'saveCursor',
      query: 'saveQuery',
      selectedDb: 'saveDb',
    },

  };
</script>
