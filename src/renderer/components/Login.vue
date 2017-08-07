<template lang="jade">
  div
    h1 {{ $t('common:GREETING') }}

    select(
      v-model="selected"
    )
      option(
        value=""
      ) - {{ $t('form:SELECT') }} -
      option(
        v-for="driver in drivers.drivers"
      ) {{ driver.name }}
</template>

<script>
  import Driver from '../lib/driver';

  const drivers = Driver.load()
    .sort();

  export default {
    data () {
      return {
        drivers,
        selected: '',
      };
    },
  };
</script>
