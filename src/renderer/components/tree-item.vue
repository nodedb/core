<template lang="jade">
  li(
    v-on:click.prevent.stop="trigger",
    :class="{ 'tree--open': isOpen, 'tree--closed': !isOpen }"
  )
    .tree-node
      span(
        :class="{'open-close-icon': this.hasChildren, 'open-close-icon-spacer': !this.hasChildren }"
      )

      span.icon
        i.fa.fa-fw( :class="'fa-' + node.icon")

      span.name {{ node.name }}

    ul.vue-tree.vue-tree__children
      vue-tree-item(
        v-for="child in children",
        :node="child"
      )

</template>

<script>
  /**
   * tree-item
   */

  /* Node modules */

  /* Third-party modules */
  import { _ } from 'lodash';

  /* Files */

  export default {

    created () {
      return this.fetchData();
    },

    data () {
      return {
        children: [],
        hasChildren: false,
        isOpen: false,
      };
    },

    methods: {
      fetchData () {
        this.children = this.node.children;
        this.hasChildren = _.isFunction(this.node.contents) || _.isArray(this.node.children);
        this.isOpen = false;
      },

      trigger () {
        return Promise.resolve()
          .then(() => {
            if (_.isFunction(this.node.contents)) {
              return this.node.contents();
            } else if (_.isArray(this.node.children)) {
              return this.node.children;
            }

            return [];
          })
          .then((children) => {
            this.children = children;
            this.isOpen = !this.isOpen;
          });
      },
    },

    props: {
      node: {
        type: Object,
      },
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
