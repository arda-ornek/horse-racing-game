import { horseNames, colors, roundDistances } from "../constants";

export default {
  namespaced: true,

  state: () => ({
    horses: [],
    raceSchedule: [],
    currentRound: null,
    raceStatus: "idle",
    raceResults: [],
    currentRoundIndex: 0,
    raceStarted: false,
    raceFinished: false,
    currentPositions: {},
    elapsedTime: 0,
  }),

  mutations: {
    setHorses(state, horses) {
      state.horses = horses;
    },
    setRaceSchedule(state, schedule) {
      state.raceSchedule = schedule;
    },
    setCurrentRound(state, round) {
      state.currentRound = round;
    },
    setRaceStatus(state, status) {
      state.raceStatus = status;
    },
    setRaceResults(state, result) {
      state.raceResults.push(result);
    },
    clearRaceResults(state) {
      state.raceResults = [];
      state.currentRoundIndex = 0;
    },
    incrementRoundIndex(state) {
      state.currentRoundIndex++;
    },
    resetRaceState(state) {
      state.raceStarted = false;
      state.raceFinished = false;
      state.currentPositions = {};
      state.raceResults = [];
      state.elapsedTime = 0;
      state.currentRound = null;
      state.currentRoundIndex = 0;
    },
    generateProgram(state) {
      state.raceStatus = "idle";
    },
  },

  actions: {
    generateHorses({ commit }) {
      const horses = [];
      const usedCombinations = new Set();

      const availableNames = [...horseNames];
      const availableColors = [...colors];

      for (let i = 0; i < 20; i++) {
        const randomNameIndex = Math.floor(
          Math.random() * availableNames.length
        );
        const name = availableNames.splice(randomNameIndex, 1)[0];
        const randomColorIndex = Math.floor(
          Math.random() * availableColors.length
        );
        const color = availableColors.splice(randomColorIndex, 1)[0];
        const condition = Math.floor(Math.random() * 100) + 1;

        horses.push({
          id: horses.length + 1,
          name,
          condition,
          color,
        });
      }

      horses.sort((a, b) => {
        if (a.name === b.name) {
          return b.condition - a.condition;
        }
        return a.name.localeCompare(b.name);
      });

      commit("setHorses", horses);
    },

    generateProgram({ commit, state, dispatch }) {
      commit("resetRaceState");
      commit("generateProgram");
      dispatch("generateHorses");

      const schedule = [];

      for (let roundIndex = 0; roundIndex < 6; roundIndex++) {
        const shuffledHorses = [...state.horses]
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);

        const round = {
          roundNumber: roundIndex + 1,
          distance: roundDistances[roundIndex],
          horses: shuffledHorses,
        };

        schedule.push(round);
      }

      commit("setRaceSchedule", schedule);
      commit("clearRaceResults");
    },

    startRace({ commit, state }) {
      if (state.raceStatus === "racing") return;

      if (state.currentRoundIndex >= state.raceSchedule.length) {
        commit("clearRaceResults");
        return;
      }

      commit("setCurrentRound", state.raceSchedule[state.currentRoundIndex]);
      commit("setRaceStatus", "racing");
    },

    pauseRace({ commit }) {
      commit("setRaceStatus", "paused");
    },

    finishRound({ commit, state, dispatch }) {
      commit("setRaceStatus", "transitioning");

      commit("incrementRoundIndex");

      if (state.currentRoundIndex < state.raceSchedule.length) {
        commit("setCurrentRound", state.raceSchedule[state.currentRoundIndex]);

        setTimeout(() => {
          commit("setRaceStatus", "racing");
        }, 100);
      } else {
        commit("setRaceStatus", "idle");
        commit("setCurrentRound", null);
      }
    },
  },

  getters: {
    getHorses: (state) => state.horses,
    getRaceSchedule: (state) => state.raceSchedule,
    isRaceComplete: (state) =>
      state.currentRoundIndex >= state.raceSchedule.length,
  },
};
