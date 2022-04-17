<template>
  <div>

    <div class="centred">

      <div style="padding-top: 100px; padding-bottom: 100px">

        <div style="padding-bottom: 30px">
          <router-link to="/">
            <img :src="require('./logo.png').default" class="centered logo"> <br/>
            <a href="#">HOME</a>
          </router-link>
        </div>

        <template v-if="status">
          <div class="centred">
            {{status}}
          </div>
        </template>
        <template v-else>

          <div style="padding-bottom: 30px">
            Address: {{address}} <br/>
            Coins: <strong>{{balance}}</strong> <br/>
          </div>

          <template v-if="showC1">
              <div><div v-html="challenge.c1.display"></div></div>
              <div style="padding-top: 10px; padding-bottom: 50px"> <input type="text" v-model="c1" :maxlength="challenge.c1.length"> {{challenge.c1.length}} letters</div>
            </template>

            <template v-if="showC2">
              <div> <img :src="'data:image/png;base64,'+challenge.c2.display"  />  </div>
              <div style="padding-top: 10px; padding-bottom: 50px"> <input type="text" v-model="c2" :maxlength="challenge.c2.length"> {{challenge.c2.length}} letters </div>
            </template>

            <template v-if="showC3">
              <div> <img :src="challenge.c3.display"  />  </div>
              <div style="padding-top: 10px; padding-bottom: 0px"> <input type="text" v-model="c3" :maxlength="challenge.c3.length"> {{challenge.c3.length}} letters</div>
            </template>

            <template v-if="showC4">
              <div> <img :src="'data:image/png;base64,'+challenge.c4.display"  />  </div>
              <div style="padding-top: 10px; padding-bottom: 0px"> <input type="text" v-model="c4" :maxlength="challenge.c4.length"> {{challenge.c4.length}} letters</div>
            </template>

            <template v-if="showC5">
              <div> <img :src="'data:image/png;base64,'+challenge.c5.display"  />  </div>
              <div style="padding-top: 10px; padding-bottom: 50px"> <input type="text" v-model="c5" :maxlength="challenge.c5.length"> {{challenge.c5.length}} letters</div>
            </template>

            <template v-if="showC6">
              <div> <img :src="'data:image/png;base64,'+challenge.c6.display"  />  </div>
              <div style="padding-top: 10px; padding-bottom: 50px"> <input type="text" v-model="c6" :maxlength="challenge.c6.length"> {{challenge.c6.length}} letters</div>
            </template>

            <template v-if="showC7">
              <div>
                <div class="parent">
                  <img ref="puzzle" :src="'data:image/png;base64,'+challenge.c7.display" class="image1" />
                  <img :src="'data:image/png;base64,'+challenge.c7.piece" class="image2" :style="`left: ${ Number.parseFloat(c7X) + puzzleLeft() -8 }px; top:${ Number.parseInt(c7Y)  }px`" />
                  <input ref="sliderY" type="range" class="vertical" min="0" :max="challenge.c7.height - challenge.c7.pieceHeight" step="1" v-model="c7Y" :style="`width: ${challenge.c7.height}px; top: ${challenge.c7.height/2-15}px; left: ${puzzleLeft() - challenge.c7.height/2 + challenge.c7.width+5}px;`" >
                </div>
                <div>
                  <input ref="sliderX" type="range" min="0" :max="challenge.c7.width - challenge.c7.pieceWidth" v-model="c7X" step="1" :style="`width: ${challenge.c7.width}px`">
                </div>
              </div>

              <div style="padding-bottom: 50px" />
            </template>

            <template v-if="showC8">
              <div>
                <audio controls="controls">
                  <source :src="`${backend}/${challenge.c8.audio}`" />
                </audio>
              </div>
              <div style="padding-top: 10px; padding-bottom: 50px"> <input type="text" v-model="c8"> </div>
            </template>

            <template v-if="showC9">
              <vue-hcaptcha :sitekey="hcaptcha_siteKey" @verify="hcaptchaVerified" ></vue-hcaptcha>
            </template>

            <template v-if="type === 'challenge'">



            </template>

            <label v-if="challengeErr" style="color: red; padding-top: 30px">
              {{challengeErr}}
            </label>
            <label v-if="challengeAns" style="color: green; padding-top: 30px">
              {{challengeAns}}
            </label>

            <div style="padding-top: 30px" />

            <button v-if="type ==='challenge' " @click="send" class="big-button" type="submit">GET 50 COINS!</button>
            <button v-if="type ==='answer' " @click="getCaptcha" class="big-button big-button-try-again" type="submit">Try again!</button>

        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from "src/config"
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

export default {

  components: {VueHcaptcha},

  mounted(){
    this.getCaptcha()
  },

  data(){
    return {
      status: 'Loading',
      challenge: null,

      showC1: true,
      showC2: true,
      showC3: true,
      showC4: true,
      showC5: true,
      showC6: true,
      showC7: true,
      showC8: true,
      showC9: true,

      c1: "",
      c2: "",
      c3: "",
      c4: "",
      c5: "",
      c6: "",
      c7X: 0,
      c7Y: 0,
      c8:"",
      c9:"",

      address:"",

      challengeErr: "",
      challengeAns: "",

      type: "",
    }
  },

  computed:{
    backend(){
      return config.backend
    },
    hcaptcha_siteKey(){
      return config.hcaptcha_siteKey
    },
  },

  methods: {
    puzzleLeft(){
      return this.$refs.puzzle ? this.$refs.puzzle.getBoundingClientRect().left : 0
    },
    puzzleTop(){
      return this.$refs.puzzle ? this.$refs.puzzle.getBoundingClientRect().top : 0
    },

    async getCaptcha(){

      try{

        Object.assign(this.$data, this.$options.data())
        this.status = "Loading captcha..."

        this.address = localStorage.getItem('address') || ''
        if (!this.address) return this.$router.push('/')

        const res = await axios.post(config.backend+'/captcha', {
          address: this.address,
        })

        if (!res || !res.data) throw "Captcha couldn't be retrieved"
        if (!res.data.result) throw res.data.error

        this.challenge = res.data
        this.status = ""
        this.balance = res.data.b

        this.type = "challenge"

        setTimeout(()=>{
          this.c7X = 1
          this.c7Y = 1
        }, 100)

      }catch(err){
        this.status = "Error: "+err.toString()
      }
    },

    hcaptchaVerified(token){
      this.c9 = token
    },

    async send(){
      try{

        this.challengeErr = ""
        this.challengeAns = ""

        for (let i=1; i <= 9; i++) this[`showC${i}`] = false

        const {data} = await axios.post(config.backend+'/solution', {
          id: this.challenge.id,
          c1: this.c1,
          c2: this.c2,
          c3: this.c3,
          c4: this.c4,
          c5: this.c5,
          c6: this.c6,
          c7: {x: this.c7X, y: this.c7Y},
          c8: this.c8,
          c9: this.c9,
          address: this.address,
        })

        if (!data)
          throw "No answer !??"

        if (!data.result){

          const error = data.error

          for (let i=1; i <= 9; i++)
            if (error.indexOf(`Challenge ${i}`) === 0)
              this[`showC${i}`] = true

          this.challengeErr = error
          return
        }

        this.challengeAns = "Well done!"
        this.balance = data.b

      }catch(error) {
        this.status = error.message
      }finally{
        this.type = "answer"
      }
    },

  },

}
</script>

<style scoped>
.centred{
  text-align: center;
}
.parent {
  position: relative;
  top: 0;
  left: 0;
}

.image1 {
  position: relative;
  top: 0;
  left: 0;
}

.image2 {
  position: absolute;
  border: 1px solid #000000;
}
 .vertical {
  position:absolute;
  -webkit-transform: rotate(90deg);
}
.big-button {
  display: block;
  width: 100%;
  border: none;
  background-color: #04AA6D;
  padding: 14px 28px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
}
.big-button-try-again {
  background-color: #AAAAAA;
}
.logo{
  max-width: 400px;
}
</style>
