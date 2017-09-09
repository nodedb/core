<template lang="jade">
  .query_input {{ value }}
</template>

<script>
  /**
   * editor
   */

  /* Node modules */

  /* Third-party modules */
  import ace from 'brace';

  /* Files */

  export default {

    data () {
      return {
        editor: null,
      };
    },

    mounted () {
      const lang = this.lang || 'text';
      const theme = this.theme || 'chrome';

      // eslint-disable-next-line global-require, import/no-dynamic-require
      require(`brace/mode/${lang}`);
      // eslint-disable-next-line global-require, import/no-dynamic-require
      require(`brace/theme/${theme}`);

      this.editor = ace.edit(this.$el);

      this.editor.$blockScrolling = Infinity;
      this.editor.getSession().setMode(`ace/mode/${lang}`);
      this.editor.setTheme(`ace/theme/${theme}`);

      this.editor.on('change', () => {
        const value = this.editor.getValue();

        this.$emit('input', value);
      });
    },

    props: {
      lang: String,
      theme: String,
      value: {
        required: true,
        type: String,
      },
    },

  };
</script>
