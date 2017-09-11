<template lang="jade">
  li(
    v-on:click.prevent.stop="trigger(false)",
    :class="{ 'tree--open': isOpen, 'tree--closed': !isOpen }"
  )
    .tree-node
      span(
        v-on:click.prevent.stop.self="trigger(true)",
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
  import store from '../store';

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

      trigger (openClose) {
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
            if (openClose) {
              this.isOpen = !this.isOpen;
            }

            store.commit('saveDbSession', {
              id: this.$route.path,
              key: 'activeDb',
              value: this.node.db,
            });
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
