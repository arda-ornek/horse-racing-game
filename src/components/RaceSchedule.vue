<template>
  <div class="race-schedule">
    <h2>Program</h2>
    <div class="rounds">
      <div v-for="round in raceSchedule" :key="round.roundNumber" class="round">
        <div class="round-header">
          {{ round.roundNumber }}ST LAP - {{ round.distance }}m
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(horse, index) in round.horses" :key="horse.id">
              <td>{{ index + 1 }}</td>
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

export default {
  name: "RaceSchedule",

  computed: {
    ...mapState({
      raceSchedule: (state) => state.horse.raceSchedule,
    }),
  },
};
</script>

<style scoped>
.race-schedule {
  border: 1px solid #ccc;
  background: white;
  height: 760px;
  display: flex;
  flex-direction: column;
}

h2 {
  background-color: #4169e1;
  color: white;
  margin: 0;
  padding: 10px;
  text-align: center;
  font-size: 1.1em;
}

.rounds {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0;
}

.round {
  border-bottom: 1px solid #ccc;
}

.round:last-child {
  border-bottom: none;
}

.round-header {
  background-color: #f0f0f0;
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
