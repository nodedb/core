<template lang="jade">
  v-app(
    :dark="dark"
  )
    v-navigation-drawer(
      clipped,
      fixed,
      permanent,
      mini-variant,
      app
    )
      v-toolbar.transparent(flat)
        v-list
          v-tooltip(right)
            span {{ appName }}
            v-list-tile(
              avatar
              slot="activator"
            )
              v-list-tile-avatar
                img(
                  src="https://randomuser.me/api/portraits/men/85.jpg"
                )

      v-list.pt-0
        v-divider

        v-tooltip(
          right,
          v-for="item in actions"
          v-if="item.conditional ? item.conditional() : true"
        )
          span {{ item.title }}
          v-list-tile(
            slot="activator",
            @click="item.action()"
          )
            v-list-tile-action
              v-icon {{ item.icon }}

    v-dialog(
      v-model="disconnectModal"
      max-width="300"
    )
      v-card(v-if="disconnectError" color="error")
        v-card-title.headline {{ $t('modal:DISCONNECTION_ERROR') }}
        v-card-text {{ disconnectError.message }}
        v-card-actions
          v-spacer
          v-btn(
            flat="flat",
            @click.native="disconnectModal = false"
          ) {{ $t('buttons:CLOSE') }}

      v-card(v-else-if="!disconnectError && disconnectModal")
        v-card-title.headline {{ $t('modal:CONFIRM_TITLE') }}
        v-card-text {{ $t('modal:DISCONNECT_MESSAGE', { name: getConnection(disconnectId).connectionName }) }}
        v-card-actions
          v-spacer
          v-btn(
            flat="flat",
            @click.native="disconnectModal = false"
          ) {{ $t('buttons:CANCEL') }}

          v-btn(
            color="error",
            flat="flat",
            @click="disconnect"
          ) {{ $t('buttons:OK') }}

    v-content
      v-tabs(
        v-model="activeId"
      )
        v-tabs-bar(
          color="grey darken-4"
        )
          v-tabs-item(
            v-for="item in connections",
            :to="{ name: 'query', params: { id: item.id } }"
            ripple
          )
            v-avatar.avatar--margin-right(
              tile
              size="24px"
            )
              img(
                :src="item.driver.logo"
              )
            v-badge.badge--icon-vertical(color="error")
              v-icon(
                slot="badge",
                @click.self.prevent.stop="confirmDisconnection(item.id)"
              ) close
              span {{ item.connection.connectionName }}

          v-tabs-slider(color="yellow")

      v-container(
        fluid
        grid-list-md
      )
        v-layout(row wrap)
          router-view

    v-footer(
      app
      fixed
    )
      span &copy; 2017
</template>

<script>
  /**
   * app
   */

  /* Node modules */

  /* Third-party modules */
  import { remote } from 'electron';

  /* Files */
  import logger from '../lib/logger';

  export default {

    created () {
      this.fetchData();
    },

    data () {
      return {
        actions: [{
          action: () => this.$router.push({
            name: 'login',
            query: {
              id: '@todo',
            },
          }),
          conditional: () => this.connections.length > 0,
          icon: 'add',
          title: this.$i18n.t('pages:NEW_CONNECTION'),
        }, {
          action: () => this.$router.push({
            name: 'settings',
          }),
          icon: 'settings',
          title: this.$i18n.t('pages:SETTINGS'),
        }],
        activeId: null,
        appName: remote.app.getName(),
        connections: [],
        dark: true,
        disconnectError: null,
        disconnectId: null,
        disconnectModal: false,
      };
    },

    methods: {
      confirmDisconnection (id) {
        this.disconnectId = id;
        this.disconnectModal = true;
      },

      disconnect () {
        const id = this.disconnectId;

        logger('trace', 'Disconnecting from database', {
          id,
          connection: this.connections[id],
        });

        return this.$store.dispatch('connections/removeById', id)
          .then((index) => {
            logger('trace', 'Disconnected from database', {
              id,
              connection: this.connections[id],
            });

            /* Update the data */
            this.fetchData();

            /* Clear down the modal */
            this.disconnectId = null;
            this.disconnectModal = false;

            if (this.connections.length === 0) {
              /* No connections available - to login page */
              return this.$router.push({
                name: 'login',
              });
            }

            /* Do we need to redirect */
            if (this.activeId === id) {
              let newIndex = index - 1;
              if (newIndex < 0) {
                newIndex = 0;
              }

              return this.$router.push({
                name: 'query',
                params: {
                  id: this.connections[newIndex].id,
                },
              });
            }

            return undefined;
          })
          .catch((err) => {
            logger('error', 'Error disconnecting from database', {
              id,
              connection: this.connections[id],
              err,
            });

            this.disconnectModal = true;
            this.disconnectError = err;
          });
      },

      fetchData () {
        this.connections = this.$store.getters['connections/list'];
        this.activeId = this.$route.params.id;
      },

      getConnection (id) {
        try {
          return this.$store.getters['connections/getById'](id).connection;
        } catch (err) {
          return {};
        }
      },
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>

<style lang="scss">
  .avatar--margin-right {
    margin: {
      right: 10px;
    }
  }

  .badge--icon-vertical {
    .icon {
      margin: initial;
    }
  }
</style>
