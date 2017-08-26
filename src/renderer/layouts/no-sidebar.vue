<template lang="jade">
  .layout.layout--no-sidebar
    router-view(
      name="connections"
    )

    .main-content

      .main-content__body
        router-view(
          name="body"
        )
</template>

<script>
  /**
   * login
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
