<template lang="jade">
  ul.nav.nav-tabs
    li.nav-item(
      v-for="connection in connectionList"
    )

      a.nav-link(
        href="#"
        v-on:click.prevent.self="selectConnection(connection.id)",
        :class="{ 'active': connection.active }"
      ) {{ connection.name || 'duh' }}

        a(
          href="#"
          v-on:click.prevent="removeConnection(connection.id)"
        ) kill

    li.nav-item

      router-link.nav-link(
        :to="{ name: 'login' }"
      ) add

    li.nav-item
      a.nav-link {{ connectionId }}

</template>

<script>
  /**
   * connections
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

    data () {
      return {
        connectionId: this.$route.meta.connection.id,
        connectionList: this.$route.meta.connectionList,
      };
    },

    methods: {
      fetchData () {
        this.connectionId = this.$route.meta.connection.id;
        this.connectionList = this.$route.meta.connectionList;
      },

      removeConnection (id) {
        return store.dispatch('removeConnection', {
          id,
        }).then(() => {
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
    },

    watch: {
      $route: 'fetchData',
    },
  };
</script>
