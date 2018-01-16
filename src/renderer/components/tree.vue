<template lang="jade">
  ul
    li(
      v-for="item in value"
    )
      div(
        v-if="open[item.name]",
        @click="toggleOpen(item.name)"
      ) open
      div(
        v-else,
        @click="toggleOpen(item.name)"
      ) closed

      span {{ item.name }}
</template>

<script>
  /**
   * tree
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {

    name: 'tree',

    data () {
      return {
        open: {},
      };
    },

    methods: {
      setTree () {
        this.value.forEach((value) => {
          this.open[value.name] = false;
        });
      },

      toggleOpen (key) {
        return Promise.resolve()
          .then(() => {
            const current = this.open[key];

            if (current) {
              /* Closing - nothing to do */
              return current;
            }

            const target = this.value.find(({ name }) => name === key);

            return target.contents()
              .then((result) => {
                console.log(result);
                return current;
              });
          })
          .then((current) => {
            this.open[key] = !current;
          });
      },
    },

    props: {

      value: {
        required: true,
        type: Array,
      },

    },

    watch: {
      value: 'setTree',
    },

  };
</script>
