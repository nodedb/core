<template lang="jade">
  div
    div query page {{ $t('common:LOADING_PAGE') }}
    div connections {{ connectionList.length }}
    div connection {{ connection.id }}
</template>

<script>
  /**
   * query
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {

    data () {
      return {
        connection: this.$route.meta.connection,
        connectionList: this.$route.meta.connectionList,
      };
    },

  };
</script>
