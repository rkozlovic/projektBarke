<template>
  <div class="add-smoothie container z-depth-1">
    <i class="small material-icons delete" @click="cancelAndRedirectToIndex">delete</i>
    <h2 class="center-align indigo-text">Izmjeni voznju {{rideTitle}}</h2>
    <form @submit.prevent="saveChanges">
      <div class="field title">
        <label for="title">Naziv voznje:</label>
        <input type="text" name="title" v-model="rideTitle">
      </div>
      <div class="field title">
        <label>Datum i vrijeme:</label>
        <input type="datetime-local" name="date" v-model="datetime">
      </div>
      <div class="field title">
        <label for="boatCapacity">Kapacitet:</label>
        <input type="number" name="boatCapacity" v-model="boatCapacity">
      </div>
      <div class="field title">
        <label for="duration">Trajanje:</label>
        <input type="text" name="duration" v-model="duration">
      </div>
      
      <!-- <div class="field add-ingredient">
        <label for="add-ingredient">Add an ingredient (press tab to add):</label>
        <input type="text" name="add-ingredient" @keydown.tab.prevent="addIng" v-model="another">
      </div>-->
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn indigo">Azuriraj voznju</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import slugify from "slugify";

export default {
  name: "EditRide",
  data() {
    return {
      rideTitle: this.$route.params.title,
      rideID: this.$route.params.id,
      datetime: this.$route.params.datetime,
      boatCapacity: this.$route.params.capacity,
      duration: this.$route.params.duration,
      feedback: null,
      slug: null
    };
  },
  methods: {
    saveChanges() {
      console.log(this.rideTitle, this.datetime, this.boatCapacity, this.duration)
      if (this.rideTitle && this.datetime && this.boatCapacity && this.duration) {
        this.feedback = null;
        // create a slug
        this.slug = slugify(this.rideTitle, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
        //save ride to firestore
        db.collection("voznje").doc(this.rideID).get()
          .then((snapshot) => {
            console.log(snapshot.ref)
          snapshot.ref.update({
            title: this.rideTitle,
            duration: this.duration,
            datetime: this.datetime,
            boatCapacity: this.boatCapacity
            })
            this.cancelAndRedirectToIndex();
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.feedback = "Svi podaci su obavezni";
      }
    },
    cancelAndRedirectToIndex() {
      this.rideTitle = null;
      this.datetime = null;
      this.boatCapacity = null;
      this.duration = null;
      this.$router.push({ name: "Rides" });
    }
  }
};
</script>


<style>
.add-smoothie {
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
}
.add-smoothie h2 {
  font-size: 2em;
  margin: 20px auto;
}
.add-smoothie .field {
  margin: 20px auto;
  position: relative;
}
.add-smoothie .delete {
  float: right;
  color: #aaa;
  cursor: pointer;
}
</style>

