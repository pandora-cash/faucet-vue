<template>
  <div>
    <img :src="require('./faucet.gif').default" class="center faucet-logo">
    <div style="text-align: center" class="center">
      <h1>faucet pandora cash</h1>
      <h2>free coins</h2>
      <h3>main net release candidate 1 (RC1)</h3>
      <h3>50 coins reward</h3>
      <h3>{{expired ? 'faucet expired': 'Deadline: April 16 2022, 7:00 am PST'}}</h3>
      <router-link to="/faq">faq</router-link>

      <div style="padding-top: 30px" v-if="!expired">
        <label>Your Address here</label>
        <input type="text" v-model="address" style="width: 100%; margin-top: 20px">
        <div v-if="error">
          {{error}}
        </div>
      </div>

      <div style="padding-top: 30px">
        <a href="https://wallet.pandoracash.com/" target="_blank">WALLET</a>
      </div>

      <div v-if="address && !expired" style="padding-top: 30px" @click="goForm">
        <a href="#">GET COINS NOW !</a>
      </div>

    </div>
  </div>
</template>

<script>
const validAddressAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZZ0123456789"

export default {
  data(){
    return {
      address: "",
      error: "",
    }
  },

  computed:{
    expired(){
      return true
    }
  },

  mounted(){
    this.address = localStorage.getItem('address') || ''
  },

  methods:{

    validateAddress(address){
      for (let i =0; i < address.length; i++)
        if (validAddressAlphabet.indexOf(address[i]) === -1)
          throw `Address contains invalid letters ${address[i]}`
      if (address.length < 30) throw "Address is too short."
      if (address.indexOf("PCASH") !== 0) throw "Address is invalid. It should start with PCASH..."
      return address
    },


  goForm(){
      try{
        this.error = ""
        this.validateAddress(this.address)
        localStorage.setItem('address', this.address)
        if (this.address)
          this.$router.push('/form')
      }catch(err){
        this.error = "Error: "+err.toString()
        setTimeout(() => this.error = "", 5000 )
      }

    },
  },

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
  max-width: 800px;
  opacity: 10%;
}
</style>