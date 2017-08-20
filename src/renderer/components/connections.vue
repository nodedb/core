<template lang="jade">
  .connections
    ul
      li(
        v-for="connection in connectionList"
      )

        a.nav-link.nav-link--icon(
          href="#",
          v-on:click.prevent.self="selectConnection(connection.id)",
          :class="{ 'active': connection.active }",
          :title="connection.name",
          :style="'background-image: url(' + connection.driver.iconPath + ')'"
        ) {{ truncate(connection.name) }}

          a.btn.btn-xs.btn-left-margin.btn-outline-danger(
            href="#",
            :title="$t('connect:CLOSE_CONNECTION')",
            v-on:click.prevent="removeConnection(connection.id)"
          )
            i.icon--close

      li.nav-item

        router-link.nav-link(
          :title="$t('connect:ADD_CONNECTION')",
          :to="{ name: 'login' }"
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
        connectionId: null,
        connectionList: null,
      };
    },

    methods: {
      fetchData () {
        this.connectionId = this.$route.meta.connection.id;
        this.connectionList = this.$route.meta.connectionList;
      },

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
          } else if (this.connectionId === id) {
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

      selectConnection (connectionId) {
        /* Select a new connection */
        return this.$router.push({
          name: 'query',
          params: {
            connectionId,
          },
        });
      },

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
