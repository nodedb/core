<template lang="jade">
  .navigation
    .navbar__content

      ul.nav-icons
        li(
          v-for="item in menu"
        )
          a(
            href="#",
            :title="item.title"
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
    data () {
      return {
        menu: [{
          title: 'some title',
          icon: 'wifi',
        }, {
          title: 'run',
          icon: 'play',
        }],
      };
    },
  };
</script>
