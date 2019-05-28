<template>
  <div class="login container">
    <form class="card-panel" @submit.prevent="login">
      <h2 class="center indigo-darken-3-text">Login</h2>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email">
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password">
      </div>
      <p v-if="feedback" class="red-text center">{{ feedback }}</p>
      <div class="field center">
        <button class="btn indigo darken-3">Login</button>
      </div>
      <div class="col-md-4">
        <div class="field center">
          <input type="button" @click="resetPassword" value="Reset password" class="btn btn-primary w-100">
        </div>
        </div>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data(){
    return{
      email: null,
      password: null,
      feedback: null
    }
  },
  methods: {
    resetPassword(){
      var auth = firebase.auth();
      var emailAddress = this.email;

      auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
      }).catch(function(error) {
        // An error happened.
      });
    },
    login(){
      if(this.email && this.password){
        this.feedback = null
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          //console.log(user)
          this.$router.push({ name: 'Rides' })
        }).catch(err => {
          this.feedback = err.message
        })
      } else {
        this.feedback = 'Molimo popunite oba polja.'
      }
    }
  }
}
</script>

<style>
.login{
  max-width: 400px;
  margin-top: 60px;
}
.login h2{
  font-size: 2.4em;
}
.login .field{
  margin-bottom: 16px;
}
</style>
