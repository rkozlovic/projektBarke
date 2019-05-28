<template>
  <div class="signup container">
    <form class="card-panel" @submit.prevent="signup">
      <h2 class="center indigo-darken-3-text">Signup</h2>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email">
      </div>
      <div class="field">
        <label for="password">Lozinka</label>
        <input id="password" type="password" v-model="password">
      </div>
      <div class="field">
        <label for="name">Djelatnik</label>
        <input id="name" type="text" v-model="employee">
      </div>
      <p v-if="feedback" class="red-text center">{{ feedback }}</p>
      <div class="field center">
        <button class="btn indigo darken-3">Signup</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import slugify from "slugify";
import firebase from "firebase";

export default {
  name: "Signup",
  data() {
    return {
      email: null,
      password: null,
      employee: null,
      feedback: null,
      slug: null
    };
  },
  methods: {
    signup() {
      if (this.employee && this.email && this.password) {
        this.feedback = null;
        this.slug = slugify(this.employee, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
        let ref = db.collection("employees").doc(this.slug);
        ref.get().then(doc => {
          console.log("doc = ", doc);
          if (doc.exists) {
            this.feedback = "Djelatnik s tim imenom vec postoji u sustavu";
          } else {
            // this employee does not yet exists in the db
            firebase
              .auth()
              .createUserWithEmailAndPassword(this.email, this.password)
              .then(cred => {
                ref.set({
                  employee: this.employee,
                  user_id: cred.user.uid
                });
              })
              .then(() => {
                this.$router.push({ name: "Index" });
              })
              .catch(err => {
                this.feedback = err.message;
              });
          }
        });
      } else {
        this.feedback = "Molimo popunite sva polja";
      }
    }
  }
};
</script>

<style>
.signup {
  max-width: 400px;
  margin-top: 60px;
}
.signup h2 {
  font-size: 2.4em;
}
.signup .field {
  margin-bottom: 16px;
}
</style>

