<template lang="jade">
  v-app(dark)
    v-navigation-drawer(
      clipped,
      fixed,
      permanent,
      :mini-variant.sync="mini",
      app
    )
      v-toolbar.transparent(flat)
        v-list.pa-0
          v-list-tile(avatar)
            v-list-tile-avatar
              img(
                src="https://randomuser.me/api/portraits/men/85.jpg"
              )
            v-list-tile-content
              v-list-tile-title hello world
            v-list-tile-action
              v-btn(
                icon
                @click.native.stop="mini = !mini"
              )
                v-icon chevron_left

      v-list.pt-0(dense)
        v-list-tile(@click="")
          v-list-tile-action
            v-icon dashboard
          v-list-tile-content
            v-list-tile-title Dashboard

    v-content
      v-container(
        fluid
        fill-height
      )
        v-layout
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
        dark: false,
        mini: true,
      };
    },

  };
</script>
