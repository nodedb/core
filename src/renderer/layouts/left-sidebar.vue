<template lang="jade">
  .layout.layout--left-sidebar
    router-view(
      name="connections"
    )

    .main-content
      .main-content__sidebar
        <!--router-view(-->
        <!--name="sidebar"-->
        <!--)-->

      .main-content__body

        .main-content__body__main
          <!--router-view(-->
          <!--name="body"-->
          <!--)-->
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
      return {};
    },
  };
</script>
