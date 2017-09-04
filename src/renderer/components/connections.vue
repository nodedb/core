<template lang="jade">
  .connections
    ul
      li(
        :class="{ active: isPage('home') }"
      )
        a.nav-link(
          href="#",
          v-shortkey="[ 'ctrl', 'h' ]",
          @shortkey="homepage()",
          v-on:click.prevent="homepage()",
          :title="$t('common:HOMEPAGE_TITLE')",
        )
          i.icon--home

      li(
        v-for="(connection, index) in connectionList",
        :class="{ active: connection.active }"
      )

        a.nav-link.nav-link--icon(
          href="#",
          v-shortkey="[ 'alt', (index + 1) ]",
          @shortkey="selectConnection(connection.connectionId)",
          v-on:click.prevent.self="selectConnection(connection.connectionId)",
          :title="connection.connectionName",
          :style="'background-image: url(' + connection.iconPath + ')'"
        ) {{ truncate(connection.connectionName) }}

          a.btn.btn-xs.btn-left-margin(
            href="#",
            :title="$t('connect:CLOSE_CONNECTION')",
            v-on:click.prevent="removeConnection(connection.connectionId)"
          )
            i.icon--close

      li.nav-item(
        v-if="displayNew !== false",
        :class="{ active: isPage('login') }"
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
      document.onkeyup = ($event) => {
        if ($event.ctrlKey && $event.keyCode === 9) {
          if ($event.shiftKey) {
            this.previousConnection();
          } else {
            this.nextConnection();
          }
        }
      };

      return this.fetchData();
    },

    data () {
      return {
        activeConnection: null,
        connectionList: null,
        displayNew: false,
      };
    },

    methods: {

      /**
       * Connection ID
       *
       * Gets the currently active connection ID
       * or returns undefined;
       *
       * @returns {string|undefined}
       */
      connectionId () {
        if (this.activeConnection) {
          return this.activeConnection.connectionId;
        }

        return undefined;
      },

      /**
       * Fetch Data
       *
       * Fetches all the data to make this component
       * work
       */
      fetchData () {
        this.activeConnection = this.$route.meta.connection;
        this.connectionList = this.$route.meta.connectionList;
        this.displayNew = this.$route.meta.displayNew;
      },

      findIndex (id) {
        return _.findIndex(this.connectionList, con => con.connectionId === id);
      },

      homepage () {
        return this.$router.push({
          name: 'home',
        });
      },

      /**
       * Is Page
       *
       * Is it a specific page?
       *
       * @param {string} name
       * @returns {boolean}
       */
      isPage (name) {
        return this.$route.name === name;
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
            /* Default to blank string - query strings can't cope with non-strings */
            active: this.connectionId() || '',
          },
        });
      },

      /**
       * Next Connection
       *
       * Selects the next connection to the
       * active connection. Cycles along the connection
       * list.
       *
       * @returns {*}
       */
      nextConnection () {
        const id = this.connectionId();

        if (id) {
          let nextId = this.findIndex(id) + 1;

          if (!this.connectionList[nextId]) {
            /* Back to the start */
            nextId = 0;
          }

          return this.selectConnection(this.connectionList[nextId].connectionId);
        }

        return undefined;
      },

      /**
       * Previous Connection
       *
       * Selects the previous connection to the
       * active connection. Cycles along the connection
       * list.
       *
       * @returns {*}
       */
      previousConnection () {
        const id = this.connectionId();

        if (id) {
          let nextId = this.findIndex(id) - 1;

          if (!this.connectionList[nextId]) {
            /* Go to the end */
            nextId = this.connectionList.length - 1;
          }

          return this.selectConnection(this.connectionList[nextId].connectionId);
        }

        return undefined;
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
          const index = this.findIndex(id);

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
              this.connectionList[index].connectionId : this.connectionList[index - 1].connectionId;

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
