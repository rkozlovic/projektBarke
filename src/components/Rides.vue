<template>
  <div class="index container">
    <a href class="right btn-floating btn-large halfway-fab blue">
      <router-link :to="{ name: 'NewRide' }">
        <i class="material-icons">add</i>
      </router-link>
    </a>
    <div class="card" v-for="voznja in voznje" :key="voznja.id">
      <div class="card-content" @click="openReservations(voznja.title,voznja.id)">
        <i class="material-icons delete" @click="deleteRide(voznja.id)">delete</i>
        <h2 class="indigo-text">{{ voznja.title }}</h2>
        <h2 id="left">polazak: {{ getDepartueTime(voznja.datetime) }}</h2>
        <p>trajanje: {{ voznja.duration }}</p>
        <ul class="ingredients">
          <li>
            <span class="blue lighten-2 chip">{{ voznja.boatCapacity}}</span>
            <span class="green lighten-3 chip">{{ voznja.boatCapacity - voznja.reservedSeats}}</span>
          </li>
        </ul>
      </div>

      <i
        class="small material-icons edit"
        @click="editRide(voznja.title,voznja.id, voznja.datetime, voznja.boatCapacity, voznja.duration)"
      >edit</i>
      <!-- <ul class="ingredients">
           <li v-for="(rezervacija, index) in voznja.rezervacije" :key="index">
            <span class="chip">{{ vo}}</span>
          </li> 
      </ul>-->
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";

export default {
  name: "Rides",
  data() {
    return {
      voznje: []
    };
  },
  methods: {
    deleteRide(id) {
      // delete doc from firestore
      db.collection("voznje")
        .doc(id)
        .delete()
        .then(() => {
          this.voznje = this.voznje.filter(voznja => {
            return voznja.id != id;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    editRide(title, id, datetime, capacity, duration) {
      // delete doc from firestore
      this.$router.push({
        name: "EditRide",
        params: { title, id, datetime, capacity, duration }
      });
    },
    getDepartueTime(datetime) {
      var time = datetime.slice(-5);
      return time;
    },
    openReservations(title, id) {
      this.$router.push({ name: "Reservations", params: { title, id } });
    }
  },
  created() {
    // fetch data from firestore
    db.collection("voznje")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let voznja = doc.data();
          voznja.id = doc.id;
          this.voznje.push(voznja);
        });
      });
  }
};
</script>

<style>
.index {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
  margin-top: 60px;
}
.index h2 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}
.index .ingredients {
  margin: 30px auto;
}
.index .ingredients li {
  display: inline-block;
}
.index .delete {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}
.index .edit {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  color: #aaa;
}
#left {
  float: left;
}
</style>
