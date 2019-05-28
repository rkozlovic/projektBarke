<template>
  <div class="add-smoothie container z-depth-1">
    <i class="small material-icons delete" @click="cancelAndRedirectToIndex">delete</i>
    <h2 class="center-align indigo-text">Dodaj novu voznju</h2>
    <form @submit.prevent="addNewRide">
      <div class="field title">
        <label for="title">Naziv voznje:</label>
        <input type="text" name="title" v-model="title">
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
      <div v-for="(ing, index) in ingredients" class="field ingredient" :key="index">
        <label for="ingredient">Ingredient:</label>
        <input type="text" name="ingredient" v-model="ingredients[index]">
        <i class="material-icons delete" @click="deleteIng(ing)">delete</i>
      </div>
      <!-- <div class="field add-ingredient">
        <label for="add-ingredient">Add an ingredient (press tab to add):</label>
        <input type="text" name="add-ingredient" @keydown.tab.prevent="addIng" v-model="another">
      </div>-->
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn indigo">Spremi voznju</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import slugify from "slugify";

export default {
  name: "NewRide",
  data() {
    return {
      title: null,
      datetime: null,
      boatCapacity: null,
      duration: null,
      another: null,
      feedback: null,
      slug: null
    };
  },
  methods: {
    addNewRide() {
      if (this.title && this.datetime && this.boatCapacity && this.duration) {
        this.feedback = null;
        // create a slug
        this.slug = slugify(this.title, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
        //save ride to firestore
        db.collection("voznje")
          .add({
            title: this.title,
            datetime: this.datetime,
            boatCapacity: this.boatCapacity,
            duration: this.duration,
            slug: this.slug,
            reservedSeats: 0
          })
          .then(() => {
            this.$router.push({ name: "Rides" });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.feedback = "Svi podaci su obavezni";
      }
    },
    addIng() {
      if (this.another) {
        this.ingredients.push(this.another);
        this.another = null;
        this.feedback = null;
      } else {
        this.feedback = "You must enter a value to add another ingredient";
      }
    },
    deleteIng(ing) {
      this.ingredients = this.ingredients.filter(ingredient => {
        return ingredient != ing;
      });
    },
    cancelAndRedirectToIndex() {
      this.title = null;
      this.datetime = null;
      this.boatCapacity = null;
      this.reservedSeats = null;
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

