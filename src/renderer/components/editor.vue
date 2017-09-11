<template lang="jade">
  .query_input(
    :class="'language--' + lang"
  )
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

    methods: {

      createEditor () {
        if (!this.lang) {
          throw new Error('Query language must be set');
        }

        try {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          require(`brace/mode/${this.lang}`);
        } catch (err) {
          throw new Error(`Unknown query language: ${this.lang}`);
        }

        this.editor = ace.edit(this.$el);

        if (this.theme) {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          require(`brace/theme/${this.theme}`);

          this.editor.setTheme(`ace/theme/${this.theme}`);
        }

        this.editor.$blockScrolling = Infinity;
        this.editor.getSession().setMode(`ace/mode/${this.lang}`);
        this.editor.setShowPrintMargin(this.printMargin);
        this.editor.setFontSize(this.fontSize);
        this.editor.setValue(this.value, 1);

        this.editor.on('change', () => {
          const value = this.editor.getValue();

          this.$emit('input', value);
        });
      },

    },

    mounted () {
      this.createEditor();
    },

    props: {
      fontSize: {
        default: 14,
        type: Number,
      },
      lang: String,
      printMargin: false,
      theme: {
        default: 'chrome',
        type: String,
      },
      value: {
        required: true,
        type: String,
      },
    },

    watch: {
      $route: 'createEditor',
    },

  };
</script>
