<template lang="jade">
  div(
    v-if="connection"
  )
    ul.vue-tree.vue-tree__root
      li.no-pointer
        .tree-node
          span.icon
            i.icon--server.icon--fw

          span.name {{ connection.connectionString() }}

        ul.vue-tree.vue-tree__children
          vue-tree-item(
            v-for="item in toc",
            :node="item",
            :active.sync="active"
          )
</template>

<script>
  /**
   * sidebar
   */

  /* Node modules */

  /* Third-party modules */
  import { _ } from 'lodash';

  /* Files */

  export default {

    created () {
      return this.fetchData();
    },

    data: () => ({
      connection: null,
      toc: [],
    }),

    methods: {

      changeActiveDb () {
        this.$emit('update:active', this.active);
      },

      fetchData () {
        this.connection = this.$route.meta.connection;

        if (this.connection) {
          this.connection.tableOfContents()
            .then((toc) => {
              if (_.isArray(toc)) {
                this.toc = toc;
              }
            });
        }
      },

    },

    props: {
      active: String,
    },

    watch: {
      $route: 'fetchData',
      active: 'changeActiveDb',
    },

  };

</script>
