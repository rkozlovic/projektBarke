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
      <h2 class="deep-purple-text center">Rezervacije za voznju {{this.tripTitle}}</h2>
      <ul class="reservations collection">
        <li v-for="(reservation, index) in reservations" :key="index">
          <i class="material-icons delete" @click="deleteReservation(reservation)">delete</i>
          <div class="deep-purple-text">Rezervirana mjesta: {{ reservation.seats }}</div>
          <div class="deep-purple-text">Dogovorena cijena: {{ reservation.price }}</div>
          <div class="grey-text text-darken-2">Opis: {{ reservation.description }}</div>
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
    /* db.collection('voznje')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(change => {
        if(change.type == 'added' || change.type == 'modified'){
          console.log("na dobrom sam tragu",change.doc.data())
      
           this.reservations.unshift({
            price: change.doc.data().reservations.price,
            description: change.doc.data().reservations.description,
            seats: change.doc.data().reservations.seats
          }) 
        }
      }) 
    }) */
  },
  methods: {
    addNewReservation() {
      let reservedSeats = 0;
      if (this.seats && this.price && this.description) {
        this.feedback = null;

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
              this.reservations.push({
                description: this.description,
                seats: this.seats,
                price: this.price
              });
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
    },
    deleteReservation(reservation) {
      /* let array = [0, 2, 6, 7];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element == 3) {
          array.splice(index, 1);
          break;
        }
      }
      console.log(array); */
      let reservationsLocal = this.reservations;
      let seats;
      let newSeats;
      for (let index = 0; index < reservationsLocal.length; index++) {
        const element = reservationsLocal[index];
        if (
          reservation.description == element.description &&
          reservation.price == element.price &&
          reservation.seats == element.seats
        ) {
          seats = reservation.seats;
          reservationsLocal.splice(index, 1);
          break;
        }
      }
      let actualReservedSeats;
      db.collection("voznje")
        .doc(this.reservationID)
        .get()
        .then(doc => {
          console.log(doc.data());
          if (doc.data().reservedSeats) {
            actualReservedSeats = doc.data().reservedSeats;
            console.log(doc.data().reservedSeats);
            actualReservedSeats = parseInt(actualReservedSeats);
            seats = parseInt(seats);
            newSeats = actualReservedSeats - seats;
            console.log(
              typeof actualReservedSeats,
              typeof seats,
              typeof newSeats
            );
            console.log(actualReservedSeats, seats, newSeats);
            console.log("reservationsLocal ", reservationsLocal);

            db.collection("voznje")
              .doc(this.reservationID)
              .set(
                {
                  reservations: reservationsLocal,
                  reservedSeats: newSeats
                },
                { merge: true }
              )
              .then(doc => {
                console.log("successfully saved!");
              })
              .catch(err => {
                console.log("Error getting document", err);
              });
          }
        })
        .catch(err => {
          console.log("Error getting document in created lifecycle", err);
        });
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
.view-profile .delete {
  /* 
  position: absolute; */
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}
</style>