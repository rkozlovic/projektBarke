<template>
  <div class="view-profile container">
    <div class="card">
      <span class="card-title">Nova rezervacija</span>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn indigo">Dodaj rezervaciju</button>
      </div>
    </div>
    <div class="card">
      <h2 class="deep-purple-text center">Rezervacije za voznju XXX</h2>
      <ul class="reservations collection">
        <li v-for="(comment, index) in comments" :key="index">
          <div class="deep-purple-text">{{ comment.from }}</div>
          <div class="grey-text text-darken-2">{{ comment.content }}</div>
        </li>
      </ul>
      <form @submit.prevent="addComment">
        <div class="field">
          <label for="comment">Dodaj rezervaciju</label>
          <input type="text" name="comment" v-model="newComment">
        </div>
        <div class="field title">
          <label for="title">Naziv voznje:</label>
          <input type="text" name="title" v-model="title">
        </div>
        <div class="field title">
          <label>Datum i vrijeme:</label>
          <input type="datetime-local" name="title" v-model="datetime">
        </div>
        <div class="field title">
          <label for="boatCapacity">Kapacitet:</label>
          <input type="number" name="boatCapacity" v-model="boatCapacity">
        </div>
        <div class="field title">
          <label for="duration">Trajanje:</label>
          <input type="text" name="duration" v-model="duration">
        </div>
        <div class="field center-align">
          <p v-if="feedback" class="red-text">{{ feedback }}</p>
          <button class="btn indigo">Dodaj rezervaciju</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";

export default {
  name: "ViewProfile",
  data() {
    return {
      profile: null,
      newComment: null,
      feedback: null,
      comments: []
    };
  },
  created() {},
  methods: {
    addComment() {
      if (this.newComment) {
        this.feedback = null;
        db.collection("comments")
          .add({
            to: this.$route.params.id,
            from: this.user.id,
            content: this.newComment,
            time: Date.now()
          })
          .then(doc => {
            this.newComment = null;
          });
      } else {
        this.feedback = "You must enter a comment to add it";
      }
    }
  }
};
</script>

<style>
.view-profile .card {
  padding: 20px;
  margin-top: 60px;
}
.view-profile h2 {
  font-size: 2em;
  margin-top: 0;
}
.view-profile li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>

