<template lang="jade">
  .navigation
    .navbar__content

      ul.nav-icons
        li(
          v-for="(item, itemId) in menu"
        )
          a(
            href="#",
            :title="item.title",
            v-on:click.prevent="execute(itemId)"
          )
            i.icon--large(
              :class="'icon--' + item.icon"
            )

</template>

<script>
  /**
   * navbar
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {

    data: () => ({
      menu: [{
        title: 'some title',
        icon: 'add',
      }, {
        title: 'run',
        icon: 'play',
      }],
    }),

    methods: {

      execute (id) {
        console.log('Executing "%s2', this.menu[id].title);
      },

    },

  };
</script>
