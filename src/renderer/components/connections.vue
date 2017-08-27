<template lang="jade">
  .connections
    ul
      li
        a.nav-link(
          href="#",
          v-shortkey="[ 'ctrl', 'h' ]",
          @shortkey="homepage()",
          v-on:click.prevent.self="homepage()",
          title="connection.name"
        )
          i.icon--home

      li(
        v-for="(connection, index) in connectionList",
        :class="{ 'active': connection.active }"
      )

        a.nav-link.nav-link--icon(
          href="#",
          v-shortkey="[ 'alt', (index + 1) ]",
          @shortkey="selectConnection(connection.id)",
          v-on:click.prevent.self="selectConnection(connection.id)",
          :title="connection.name",
          :style="'background-image: url(' + connection.driver.iconPath + ')'"
        ) {{ truncate(connection.name) }}

          a.btn.btn-xs.btn-left-margin(
            href="#",
            :title="$t('connect:CLOSE_CONNECTION')",
            v-on:click.prevent="removeConnection(connection.id)"
          )
            i.icon--close

      li.nav-item(
        v-if="displayNew"
      )

        a.nav-link(
          href="#",
          v-on:click.prevent="newConnection()",
          :title="$t('connect:ADD_CONNECTION')",
          v-shortkey="[ 'ctrl', 'n' ]",
          @shortkey="newConnection()"
        )
          i.icon--add

</template>

<script>
  /**
   * connections
   */

  /* Node modules */

  /* Third-party modules */
  import { _ } from 'lodash';
  import { remote } from 'electron';
  import vex from 'vex-js';

  /* Files */
  import store from '../store';

  const logger = remote.app.logger;

  export default {

    created () {
      return this.fetchData();
    },

    data () {
      return {
        connection: null,
        connectionList: null,
        displayNew: false,
      };
    },

    methods: {
      connectionId () {
        if (this.connection) {
          return this.connection.id;
        }

        return null;
      },

      /**
       * Fetch Data
       *
       * Fetches all the data to make this component
       * work
       */
      fetchData () {
        this.connection = this.$route.meta.connection;
        this.connectionList = this.$route.meta.connectionList;
        this.displayNew = this.$route.name !== 'login';
      },

      homepage () {
        console.log('homepage');
      },

      /**
       * New Connection
       *
       * This is fired when the user wants to make
       * a new connection
       */
      newConnection () {
        return this.$router.push({
          name: 'login',
          query: {
            active: this.connectionId(),
          },
        });
      },

      /**
       * Remove Connection
       *
       * Prompts a user to confirm if they want to
       * remove a connection from the list and then
       * removes it.
       *
       * @param {string} id
       * @returns {Promise<never | T> | Promise.<T>}
       */
      removeConnection (id) {
        return new Promise((resolve, reject) => {
          vex.dialog.confirm({
            message: this.$i18n.i18next.t('modal:CONFIRM'),
            callback (value) {
              if (value) {
                return resolve();
              }

              return reject(new Error('CANCEL'));
            },
          });
        }).then(() => store.dispatch('removeConnection', {
          id,
        })).then(() => {
          const index = _.findIndex(this.connectionList, con => con.id === id);

          /* Remove from the list */
          this.connectionList.splice(index, 1);

          /* Now what do we do? */
          if (this.connectionList.length === 0) {
            /* All gone - back to login page */
            return this.$router.push({
              name: 'login',
            });
          } else if (this.connectionId() === id) {
            /* Route to new connection, but which one */
            const newId = _.has(this.connectionList, index) ?
              this.connectionList[index].id : this.connectionList[index - 1].id;

            return this.$router.push({
              name: 'query',
              params: {
                connectionId: newId,
              },
            });
          }

          /* Nothing to do - we're not changing page */
          return undefined;
        }).catch((err) => {
          if (err.message === 'CANCEL') {
            /* We've cancelled the request - log and move on */
            logger.trigger('trace', 'Remove connection request cancelled', {
              connectionId: id,
            });

            return;
          }

          throw err;
        });
      },

      /**
       * Select Connection
       *
       * Selects a new active connection and tells
       * the application all about it
       *
       * @todo tell the application
       * @param {string} connectionId
       */
      selectConnection (connectionId) {
        /* Select a new connection */
        return this.$router.push({
          name: 'query',
          params: {
            connectionId,
          },
        });
      },

      /**
       * Truncate
       *
       * Function to truncate the name of the
       * connection
       *
       * @param {string} str
       * @param {number} length
       * @returns {string}
       */
      truncate (str, { length = 20 } = {}) {
        return _.truncate(str, {
          length,
        });
      },
    },

    watch: {
      $route: 'fetchData',
    },
  };
</script>
