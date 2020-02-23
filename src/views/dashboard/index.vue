<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{userName}}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {login} from '../../api/index'
export default {
  data(){
    return {
      userName:{}
    }
  },
  
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
