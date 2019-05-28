<template>
  <div class="index container">
     <a href="" class="btn-floating btn-large halfway-fab blue">
          <router-link :to="{ name: 'NovaVoznja' }">
            <i class="material-icons">add</i>
          </router-link>
        </a>
    <div class="card" v-for="voznja in voznje" :key="voznja.id">
      <div class="card-content">
        <i class="material-icons delete" @click="izbrisiVoznju(voznja.id)">delete</i>
        <h2 class="indigo-text">{{ voznja.naziv }}</h2>
        <ul class="ingredients">
          <li v-for="(rezervacija, index) in voznja.rezervacije" :key="index">
            <span class="chip">{{ rezervacija.mjesta }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'

export default {
  name: 'Index',
  data(){
    return{
      voznje: []
    }
  },
  methods: {
    izbrisiVoznju(id){
      // delete doc from firestore
      db.collection('voznje').doc(id).delete()
      .then(() => {
        this.voznje = this.voznje.filter(voznja => {
          return voznja.id != id
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created(){
    // fetch data from firestore
    db.collection('voznje').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let voznja = doc.data()
        voznja.id = doc.id
        this.voznje.push(voznja)
      })
    })
  }
}
</script>

<style>
.index{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
  margin-top: 60px;
}
.index h2{
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}
.index .ingredients{
  margin: 30px auto;
}
.index .ingredients li{
  display: inline-block;
}
.index .delete{
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}

</style>
