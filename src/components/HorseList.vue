<template>
  <div class="horse-list">
    <div class="list">
      <h2>Horse List (1-20)</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>%</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="horse in horses" :key="horse.id">
              <td>{{ horse.name }}</td>
              <td>{{ horse.condition }}</td>
              <td>{{ horse.color }}</td>
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
  name: "HorseList",

  computed: {
    ...mapState({
      horses: (state) => state.horse.horses,
    }),
  },
};
</script>

<style scoped>
.horse-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list {
  border: 1px solid #ccc;
  background: white;
  display: flex;
  flex-direction: column;
  height: 760px;
}

h2 {
  font-size: 1.1em;
  background-color: #4169e1;
  color: white;
  margin: 0;
  padding: 10px;
  text-align: center;
}

.table-container {
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f5f5f5;
}

th,
td {
  padding: 6px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  color: #333;
  height: 36px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(1),
td:nth-child(1) {
  width: 50%;
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.2;
}

th:nth-child(2),
td:nth-child(2) {
  width: 20%;
  text-align: center;
  white-space: nowrap;
}

th:nth-child(3),
td:nth-child(3) {
  width: 30%;
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.2;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tbody tr:hover {
  background-color: #f8f9fa;
}

tbody td {
  background-color: white;
  vertical-align: middle;
}
</style>
