<template lang="jade">
  .layout.layout--left-sidebar
    router-view(
      name="connections"
    )

    .main-content
      .main-content__sidebar(
        :style="'width: ' + width + 'px'"
      )
        router-view(
          name="sidebar"
        )
        .sidebar-width-dragger(
          v-if="resizableSidebar",
          @mousedown="resizeStart",
          @dblclick="reset",
          :style="'left: ' + width + 'px'"
        )

      .main-content__body(
        :style="'left: ' + width + 'px'"
      )

        .main-content__body__main
          router-view(
            name="body"
          )
</template>

<script>
  /**
   * default
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */
  import store from '../store';

  export default {

    created () {
      document.onmousemove = (...args) => this.resizeSidebar(...args);
      document.onmouseup = (...args) => this.resizeStop(...args);

      return this.fetchData();
    },

    data () {
      return {
        defaultWidth: 0,
        minWidth: 0,
        maxWidth: 0,
        resize: false,
        resizableSidebar: true,
        width: 0,
      };
    },

    methods: {

      fetchData () {
        const minWidth = 100;
        const maxWidth = 500;
        const defaultWidth = (minWidth + maxWidth) / 2;
        const resizableSidebar = this.$route.meta.resizableSidebar !== false;
        const storedWidth = store.getters.getDbSession(this.$route.path, 'sidebarWidth');
        let width = defaultWidth;

        if (resizableSidebar && storedWidth) {
          width = storedWidth;
        }

        this.defaultWidth = defaultWidth;
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
        this.resize = false;
        this.resizableSidebar = resizableSidebar;
        this.width = width;
      },

      reset () {
        this.width = this.defaultWidth;

        this.save();
      },

      resizeSidebar ($event) {
        if (this.resize) {
          let width = $event.clientX;

          if (width < this.minWidth) {
            width = this.minWidth;
          } else if (width > this.maxWidth) {
            width = this.maxWidth;
          }

          this.width = width;

          this.save();
        }
      },

      resizeStart () {
        this.resize = true;
      },

      resizeStop () {
        this.resize = false;
      },

      save () {
        store.commit('saveDbSession', {
          id: this.$route.path,
          key: 'sidebarWidth',
          value: this.width,
        });
      },

    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
