<template lang="jade">
  .layout.layout--left-sidebar
    navbar

    .main-content
      .main-content__sidebar
        p sidebar
        p {{ sidebar }}

      .main-content__body
        slot
</template>

<script>
  /**
   * default
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {
    data () {
      console.log(this.sidebar);
      return {};
    },
    props: {
      sidebar: {
        type: Object,
//        default: () => [],
//        validator (value) {
//          console.log(value);
//          return false;
//        },
      },
    },
  };
</script>
