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
          v-for="item in connections"
          right
        )
          span {{ item.driver.name }}
          v-list-tile(
            avatar
            slot="activator",
            @click="connection(item.id)"
          )
            v-list-tile-action
              v-list-tile-avatar
                img(
                  :src="item.driver.logo"
                )

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

    v-content
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
          // conditional: () => this.connections.length > 0,
          icon: 'add',
          title: this.$i18n.t('pages:NEW_CONNECTION'),
        }, {
          action: () => this.$router.push({
            name: 'settings',
          }),
          icon: 'settings',
          title: this.$i18n.t('pages:SETTINGS'),
        }],
        appName: remote.app.getName(),
        connections: [],
        dark: true,
        speedDial: false,
      };
    },

    methods: {
      connection (id) {
        return this.$router.push({
          name: 'query',
          params: {
            id,
          },
        });
      },

      fetchData () {
        this.connections = this.$store.getters['connections/list'];
      },
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
