<template lang="jade">
  .query-page
    tree.db-tree(
      :style="'width: ' + treeWidth + 'px;'"
    )

    #tree-width.grey.darken-4(
      @click="resize",
      :style="'left: ' + treeWidth + 'px; width: ' + borderWidth + 'px;'"
    )

    query-builder.query-builder(
      :style="'left: ' + (treeWidth + borderWidth) + 'px; height: ' + queryHeight + 'px;'",
      :value="query"
    )

    result.query-result(
      :style="'left: ' + (treeWidth + borderWidth) + 'px; top: ' + queryHeight + 'px;'"
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
        borderWidth: 5,
        connection: undefined,
        id: null,
        query: 'select\n\t*\nfrom\n\ttable_name\nwhere\n\tvalue = 2',
        queryHeight: 250,
        treeWidth: 250,
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

      resize () {
        // @todo
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

    #tree-width {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 5px;
      cursor: ew-resize;
    }

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
