<template>
  <div class="race-results">
    <h2>Results</h2>
    <div class="results-container">
      <div
        v-for="result in raceResults"
        :key="result.roundNumber"
        class="round-result"
      >
        <div class="round-header">
          {{ result.roundNumber }}ST LAP -
          {{ getRoundDistance(result.roundNumber) }}m
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="horse in result.results" :key="horse.id">
              <td>{{ horse.position }}</td>
              <td>{{ horse.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { roundDistances } from "../constants";

export default {
  name: "RaceResults",

  computed: {
    ...mapState({
      raceResults: (state) => state.horse.raceResults,
    }),
  },

  methods: {
    getRoundDistance(roundNumber) {
      return roundDistances[roundNumber - 1];
    },
  },
};
</script>

<style scoped>
.race-results {
  border: 1px solid #ccc;
  background: white;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

h2 {
  background-color: #90ee90;
  color: #333;
  margin: 0;
  padding: 10px;
  text-align: center;
  font-size: 1.1em;
}

.results-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0;
}

.round-result {
  border-bottom: 1px solid #ccc;
}

.round-result:last-child {
  border-bottom: none;
}

.round-header {
  background-color: #ffb6b6;
  padding: 8px;
  font-weight: bold;
  text-align: left;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

thead {
  position: sticky;
  top: 36px;
  z-index: 1;
  background-color: #f5f5f5;
}

th,
td {
  padding: 6px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  color: #333;
  font-size: 0.9em;
  height: 36px;
}

th:nth-child(1),
td:nth-child(1) {
  width: 15%;
  text-align: center;
  white-space: nowrap;
}

th:nth-child(2),
td:nth-child(2) {
  width: 85%;
  padding-left: 15px;
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.2;
}

tbody td {
  vertical-align: middle;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
