<template lang="jade">
  v-app( :dark="dark" )
    component( :is="layout" )
</template>

<script>
  /**
   * app
   */

  /* Node modules */

  /* Third-party modules */
  import { _ } from 'lodash';
  import requireDir from 'require-dir';

  /* Files */

  const components = {};

  const layouts = requireDir('../layouts', {
    camelcase: true,
  });

  _.each(layouts, (layout, name) => {
    components[`${name}Layout`] = layout;
  });

  export default {

    components,

    created () {
      this.setLayout();
    },

    data () {
      return {
        dark: false,
        layout: 'defaultLayout',
      };
    },

    methods: {
      setLayout () {
        let layout = `${this.$route.meta.layout}Layout`;

        if (!this.$options.components[layout]) {
          layout = 'defaultLayout';
        }

        this.layout = layout;
      },
    },

    watch: {
      $route: 'setLayout',
    },

  };
</script>
