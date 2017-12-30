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
      v-model="query",
      :cursor.sync="cursor",
      v-on:execute="execute",
      :style="'left: ' + (treeWidth + borderWidth) + 'px; height: ' + queryHeight + 'px;'",
    )
      div(slot="buttons")
        v-btn.execute_button(
          color="primary",
          absolute,
          fab,
          bottom,
          right
          @click="execute"
        )
          v-icon send

    query-result.query-result(
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
  import queryResult from '../components/result.vue';
  import tree from '../components/tree.vue';

  export default {

    name: 'query',

    components: {
      queryBuilder,
      queryResult,
      tree,
    },

    created () {
      this.fetchData();
    },

    data () {
      return {
        borderWidth: 5,
        connection: undefined,
        cursor: null,
        id: null,
        query: 'select * from users AS u1 JOIN users AS u2',
        queryHeight: 250,
        treeWidth: 250,
      };
    },

    methods: {
      execute () {
        return this.connection.driver.query(this.query)
          .then((result) => {
            console.log({
              execute: result,
            });
          })
          .catch((err) => {
            console.log({
              err,
            });
          });
      },

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

      .execute_button {
        bottom: 16px; // Same as the "right"
      }
    }

    .query-result {
      position: absolute;
      right: 0;
      bottom: 0;
      overflow: auto;
    }

  }

</style>
