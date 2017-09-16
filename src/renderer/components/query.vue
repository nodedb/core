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
            select.custom-select(
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
      h2 result

      .error(
        v-if="err"
      ) {{ err.message || err }}

      .empty(
        v-else-if="emptyResult"
      ) empty result

      table.table(
        v-else-if="fields.length > 0"
      )

        thead
          tr
            th
              input(
                type="checkbox",
                v-model="selectAll"
              )

            th(
              v-for="field in fields"
            ) {{ field }}

        tbody
          tr(
            v-for="(row, id) in result"
          )
            td
              input(
                type="checkbox",
                v-model="selectedRows[id]"
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
  import { remote } from 'electron';

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
      emptyResult: false,
      err: null,
      fields: [],
      lang: null,
      query: null,
      result: [],
      selectAll: false,
      selectedDb: null,
      selectedRows: [],
    }),

    methods: {

      changeDb () {
        this.selectedDb = this.activeDb;
      },

      checkEmptyResult () {
        this.emptyResult = false;

        if (this.fields.length === 0) {
          this.emptyResult = true;
        }
      },

      fetchData () {
        this.connection = this.$route.meta.connection;
        this.cursor = store.getters.getDbSession(this.$route.path, 'cursor');
        this.emptyResult = false;
        this.lang = this.connection.lang;
        this.query = store.getters.getDbSession(this.$route.path, 'query') || '';
        this.selectAll = false;
        this.selectedDb = store.getters.getDbSession(this.$route.path, 'activeDb');

        const queryResult = store.getters.getDbSession(this.$route.path, 'queryResult');

        if (queryResult) {
          if (queryResult.err) {
            this.err = queryResult.err;
          } else if (queryResult.fields && queryResult.result) {
            this.fields = queryResult.fields;
            this.result = queryResult.result;
          }
        }

        return this.connection.dbList()
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

      saveQueryResult (err, result = null) {
        const value = err ? { err: { message: err.message } } : result;

        store.commit('saveDbSession', {
          id: this.$route.path,
          key: 'queryResult',
          value,
        });
      },

      selectAllRows () {
        if (this.selectAll) {
          this.selectedRows = this.result.map(() => true);
        } else {
          /* Remove all selected rows */
          this.selectedRows = [];
        }
      },

      submit () {
        /* Reset everything */
        this.err = null;
        this.fields = [];
        this.result = [];
        this.selectAll = false;

        remote.app.logger.trigger('debug', 'New DB query', {
          connection: this.connection.connectionString(),
          db: this.selectedDb,
          query: this.query,
        });

        return this.connection.query(this.selectedDb, this.query)
          .then(({ fields, result }) => {
            this.fields = fields;
            this.result = result;

            console.log(this.fields);

            this.saveQueryResult(null, {
              fields,
              result,
            });

            console.log('result');

            remote.app.logger.trigger('debug', 'DB query made successfully', {
              connection: this.connection.connectionString(),
              db: this.selectedDb,
              query: this.query,
              fields,
              result,
            });
          })
          .catch((err) => {
            this.err = err;

            this.saveQueryResult(err);

            remote.app.logger.trigger('debug', 'DB query errored', {
              connection: this.connection.connectionString(),
              db: this.selectedDb,
              query: this.query,
              err,
            });
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
      fields: 'checkEmptyResult',
      query: 'saveQuery',
      selectAll: 'selectAllRows',
      selectedDb: 'saveDb',
    },

  };
</script>
