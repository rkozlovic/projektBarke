<template>
  <div class="index container">
    <a href class="right btn-floating btn-large halfway-fab blue addbutton">
      <router-link :to="{ name: 'NewRide' }">
        <i class="material-icons">add</i>
      </router-link>
    </a>
    <div class="card" v-for="voznja in voznje" :key="voznja.id">
      <div class="card-content" @click="openReservations(voznja.title,voznja.id)">
        <i class="material-icons delete" @click="deleteRide(voznja.id)">delete</i>
        <h2 class="indigo-text">{{ voznja.title }}</h2>
        <h2 class="left">polazak: {{ getDepartueTime(voznja.datetime) }}</h2>
        <br>
        <br>
        <br>
        <p>datum voznje: {{ getDepartueDate(voznja.datetime) }}</p>
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
    getDepartueDate(datetime) {
      let date = new Date(datetime);
      let today = new Date();
      if (today.setHours(0, 0, 0, 0) == date.setHours(0, 0, 0, 0)) {
        return "DANAS";
      } else {
        return date.toDateString();
      }
    },
    openReservations(title, id) {
      this.$router.push({ name: "Reservations", params: { title, id } });
    }
  },
  created() {
    var sortBy = (function() {
      var toString = Object.prototype.toString,
        // default parser function
        parse = function(x) {
          return x;
        },
        // gets the item to be sorted
        getItem = function(x) {
          var isObject = x != null && typeof x === "object";
          var isProp = isObject && this.prop in x;
          return this.parser(isProp ? x[this.prop] : x);
        };

      return function sortby(array, cfg) {
        if (!(array instanceof Array && array.length)) return [];
        if (toString.call(cfg) !== "[object Object]") cfg = {};
        if (typeof cfg.parser !== "function") cfg.parser = parse;
        cfg.desc = !!cfg.desc ? -1 : 1;
        return array.sort(function(a, b) {
          a = getItem.call(cfg, a);
          b = getItem.call(cfg, b);
          return cfg.desc * (a < b ? -1 : +(a > b));
        });
      };
    })();
    // fetch data from firestore
    db.collection("voznje")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let rideDate = Date.parse(doc.data().datetime);
          if (rideDate > Date.now()) {
            let voznja = doc.data();
            voznja.id = doc.id;
            this.voznje.push(voznja);
            sortBy(this.voznje, { prop: "datetime", desc: false });
          } else console.log("Ride in the past");
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
.index .addbutton {
 margin-bottom: 40px;
}
#left {
  float: left;
}
</style>
