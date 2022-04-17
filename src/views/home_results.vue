<template>
  <div>
    <img :src="require('./logo.png').default" class="center faucet-logo">
    <div style="text-align: center" class="center padding">
      <h2>
        <router-link to="/results">
          faucet results
        </router-link>
      </h2>

    </div>
  </div>
</template>

<script>

export default {

}
</script>

<style scoped>
.center {
  width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.faucet-logo{
  max-width: 400px;
}
.padding{
  padding-top: 200px;
}
</style>