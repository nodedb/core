<template lang="jade">
  .query-page
    tree.db-tree(
      :style="'width: ' + treeWidth + 'px;'"
    )
    query-builder.query-builder(
      :style="'left: ' + treeWidth + 'px; height: ' + queryHeight + 'px;'"
    )
    result.query-result(
      :style="'left: ' + treeWidth + 'px; top: ' + queryHeight + 'px;'"
    )
</template>

<script>
  /**
   * query
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */
  import queryBuilder from '../components/query.vue';
  import result from '../components/result.vue';
  import tree from '../components/tree.vue';

  export default {

    name: 'query',

    components: {
      queryBuilder,
      result,
      tree,
    },

    created () {
      this.fetchData();
    },

    data () {
      return {
        connection: undefined,
        queryHeight: 250,
        treeWidth: 250,
        id: null,
      };
    },

    methods: {
      fetchData () {
        this.id = this.$route.params.id;
        this.connection = this.$store.getters['connections/getById'](this.id);

        if (!this.connection) {
          /* No connections available - to login page */
          return this.$router.push({
            name: 'login',
          });
        }

        return undefined;
      },
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>

<style lang="scss" scoped>

  .query-page {

    /* This keeps it inside the working area */
    position: absolute;
    top: 50px;
    left: 81px;
    right: 0;
    bottom: 36px;

    .db-tree {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      overflow: auto;
    }

    .query-builder {
      position: absolute;
      top: 0;
      right: 0;
      overflow: auto;
    }

    .query-result {
      position: absolute;
      right: 0;
      bottom: 0;
      overflow: auto;
    }

  }

</style>
