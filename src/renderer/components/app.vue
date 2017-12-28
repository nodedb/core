<template lang="jade">
  v-app(dark)
    v-navigation-drawer(
      v-if="connections.length > 0",
      clipped,
      fixed,
      permanent,
      mini-variant,
      app
    )
      v-toolbar.transparent(flat)
        v-list.pa-0
          v-list-tile(avatar)
            v-list-tile-avatar
              img(
                src="https://randomuser.me/api/portraits/men/85.jpg"
              )

      v-list.pt-0(dense)
        v-tooltip(
          v-for="item in connections"
          right
        )
          span spanky
          v-list-tile(
            slot="activator"
          )
            v-list-tile-action
              v-icon dashboard
            v-list-tile-content
              v-list-tile-title Dashboard

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

  /* Files */

  export default {

    data () {
      return {
        connections: this.$store.getters['connections/state'],
        dark: false,
      };
    },

    methods: {
    },

  };
</script>
