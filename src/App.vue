<script>
import HorseList from "./components/HorseList.vue";
import RaceSchedule from "./components/RaceSchedule.vue";
import RaceResults from "./components/RaceResults.vue";
import RaceTrack from "./components/RaceTrack.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    HorseList,
    RaceSchedule,
    RaceResults,
    RaceTrack,
  },

  data() {
    return {
      activeTab: "program",
    };
  },

  computed: {
    ...mapState({
      raceStatus: (state) => state.horse.raceStatus,
    }),
  },

  methods: {
    ...mapActions({
      generateProgram: "horse/generateProgram",
      startRace: "horse/startRace",
      pauseRace: "horse/pauseRace",
    }),

    toggleRace() {
      if (this.raceStatus === "racing") {
        this.pauseRace();
      } else {
        this.startRace();
      }
    },
  },
};
</script>

<template>
  <div id="app">
    <header class="header">
      <h1>Horse Racing</h1>
      <div class="controls">
        <button @click="generateProgram" class="control-btn">
          GENERATE PROGRAM
        </button>
        <button @click="toggleRace" class="control-btn">
          {{ raceStatus === "racing" ? "PAUSE" : "START" }}
        </button>
      </div>
    </header>
    <div class="container">
      <div class="column">
        <HorseList />
      </div>
      <div class="column main">
        <RaceTrack />
      </div>
      <div class="column results-section">
        <div class="race-info">
          <RaceSchedule />
          <RaceResults />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 20px;
  background-color: #e9ecef;
  color: #333;
}

body {
  margin: 0;
  background-color: #e9ecef;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffb6b6;
  padding: 10px 20px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  color: #333;
}

.controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  color: black;
  padding: 8px 16px;
  background-color: white;
  border: 2px solid #333;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.control-btn:hover {
  background-color: #f0f0f0;
}

.container {
  display: flex;
  gap: 20px;
  margin: 0 auto;
}

.column {
  flex: 1;
  min-width: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main {
  flex: 2;
  display: flex;
}

.results-section {
  flex: 1.5;
}

.race-info {
  display: flex;
  gap: 10px;
  height: 100%;
}

.race-info > * {
  flex: 1;
  min-width: 0;
}
</style>
