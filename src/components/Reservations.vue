<template>
  <div class="view-profile container">
    <div class="card">
      <span class="card-title">Nova rezervacija</span>
      <form @submit.prevent="addNewReservation">
        <div class="field">
          <label for="seats">Mjesta</label>
          <input type="number" name="seats" v-model="seats">
        </div>
        <div class="field title">
          <label for="price">Dogovorena cijena:</label>
          <input type="number" name="price" v-model="price">
        </div>
        <div class="field title">
          <label>Opis:</label>
          <input type="text" name="description" v-model="description">
        </div>
        <div class="field center-align">
          <p v-if="feedback" class="red-text">{{ feedback }}</p>
          <button class="btn indigo">Dodaj rezervaciju</button>
        </div>
      </form>
    </div>
    <div class="card">
      <h2
        class="deep-purple-text center"
      >Rezervacije za voznju {{this.tripTitle}} id: {{this.reservationID}}</h2>
      <ul class="reservations collection">
        <li v-for="(comment, index) in comments" :key="index">
          <div class="deep-purple-text">{{ comment.from }}</div>
          <div class="grey-text text-darken-2">{{ comment.content }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";

export default {
  name: "Reservations",
  data() {
    return {
      tripTitle: this.$route.params.title,
      reservationID: this.$route.params.id,
      seats: null,
      price: null,
      description: null,
      reservations: [],
      feedback: null,
      comments: []
    };
  },
  created() {
    db.collection("voznje")
      .doc(this.reservationID)
      .get()
      .then(doc => {
        if (doc.data().reservations) {
          this.reservations = doc.data().reservations;
        }
      })
      .catch(err => {
        console.log("Error getting document in created lifecycle", err);
      });
  },
  methods: {
    addNewReservation() {
      let reservedSeats = 0;
      if (this.seats && this.price && this.description) {
        this.feedback = null;
        this.reservations.push({
          description: this.description,
          seats: this.seats,
          price: this.price
        });
        db.collection("voznje")
          .doc(this.reservationID)
          .get()
          .then(doc => {
            if (doc.data().reservedSeats) {
              reservedSeats = doc.data().reservedSeats;
            }
            let boatCapacity = doc.data().boatCapacity;
            let availableSeats = boatCapacity - reservedSeats;

            this.seats = parseInt(this.seats);

            if (this.seats <= availableSeats) {
              let sum = reservedSeats + this.seats;
              db.collection("voznje")
                .doc(this.reservationID)
                .set(
                  {
                    reservations: this.reservations,
                    reservedSeats: sum
                  },
                  { merge: true }
                )
                .then(doc => {
                  console.log("successfully saved!");
                  this.clearInputs();
                });
            } else {
              this.feedback = "Buraz nema mjesta";
              this.clearInputs();
            }
          })
          .catch(err => {
            console.log("Error getting document", err);
          });
      } else {
        this.feedback = "Potrebno je ispuniti sve podatke";
      }
    },
    clearInputs() {
      this.price = null;
      this.seats = null;
      this.description = null;
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

