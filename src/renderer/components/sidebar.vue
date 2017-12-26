<template lang="jade">
  v-navigation-drawer(
    permanent,
    fixed,
    :mini-variant.sync="drawer",
  )
    v-toolbar.transparent(
      flat
    )
      v-list.pa-0
        v-list-tile(avatar)
          v-list-tile-avatar
            img(
              src="https://randomuser.me/api/portraits/men/85.jpg"
            )
          v-list-tile-content
            v-list-tile-title Simo
          v-list-tile-action
            v-btn(
              icon,
              @click.native.stop="drawer = !drawer"
            )
              v-icon chevron_left

    v-list.pt-0
      v-divider
      v-list-tile(
        v-for="item in connections",
        :key="item.title",
        @click=""
      )
        v-list-tile-action
          v-icon {{ item.icon }}
        v-list-tile-content {{ item.title }}

</template>

<script>
  /**
   * sidebar
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {

    data () {
      return {
        connections: [{
          title: 'some title',
          icon: 'visibility',
        }],
        drawer: true,
      };
    },

  };
</script>
