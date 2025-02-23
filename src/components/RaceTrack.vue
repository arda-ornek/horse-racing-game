<template>
  <div class="race-track">
    <div class="track">
      <div v-for="i in 10" :key="i" class="lane">
        <div class="lane-number">{{ i }}</div>
        <div class="lane-track">
          <img
            v-if="currentRound && currentRound.horses[i - 1]"
            :class="['horse', { racing: isRacing }]"
            :style="{ left: horsePositions[i - 1] + '%' }"
            src="/horse.png"
            alt="horse"
          />
        </div>
      </div>
    </div>
    <div class="track-info">
      <div class="lap-info" v-if="currentRound">
        {{ currentRound.roundNumber }}ST LAP {{ currentRound.distance }}m
      </div>
      <div class="finish-line">FINISH</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "RaceTrack",

  data() {
    return {
      horsePositions: Array(10).fill(0),
      horseSpeeds: Array(10).fill(0),
      finishTimes: Array(10).fill(null),
      isRacing: false,
      raceInterval: null,
      raceStartTime: null,
    };
  },

  computed: {
    ...mapState({
      currentRound: (state) => state.horse.currentRound,
      raceStatus: (state) => state.horse.raceStatus,
      raceStarted: (state) => state.horse.raceStarted,
    }),
  },

  methods: {
    ...mapMutations({
      setRaceResults: "horse/setRaceResults",
    }),

    ...mapActions({
      nextRound: "horse/nextRound",
      finishRound: "horse/finishRound",
    }),

    calculateHorseSpeed(horse, distance) {
      const baseSpeed = (horse.condition / 100) * 2;

      const randomFactor = 1.5 + (Math.random() * 0.8 - 0.4); // ±40% variation from 1.5

      return baseSpeed * randomFactor;
    },

    startRace() {
      if (!this.currentRound) return;

      this.isRacing = true;
      this.horsePositions = Array(10).fill(0);
      this.finishTimes = Array(10).fill(null);
      this.raceStartTime = Date.now();

      this.horseSpeeds = this.currentRound.horses.map((horse) =>
        this.calculateHorseSpeed(horse, this.currentRound.distance)
      );

      this.raceInterval = setInterval(() => {
        const currentTime = Date.now();
        let allFinished = true;

        this.horsePositions = this.horsePositions.map((pos, index) => {
          if (pos >= 100) {
            if (this.finishTimes[index] === null) {
              this.finishTimes[index] = currentTime - this.raceStartTime;
            }
            return 100;
          }

          allFinished = false;
          const horse = this.currentRound.horses[index];
          if (!horse) return pos;

          const speedVariation = 1 + (Math.random() * 0.1 - 0.05);
          const speed = this.horseSpeeds[index] * speedVariation;
          const newPos = pos + speed;

          if (newPos >= 100) {
            this.finishTimes[index] = currentTime - this.raceStartTime;
            return 100;
          }

          return newPos;
        });

        if (allFinished) {
          this.finishRace();
        }
      }, 50);
    },

    finishRace() {
      clearInterval(this.raceInterval);
      this.isRacing = false;

      const finishOrder = this.finishTimes
        .map((time, index) => ({ index, time }))
        .sort((a, b) => a.time - b.time)
        .map((item) => item.index);

      const results = finishOrder.map((horseIndex, position) => ({
        position: position + 1,
        ...this.currentRound.horses[horseIndex],
        finishTime: this.finishTimes[horseIndex],
      }));

      this.setRaceResults({
        roundNumber: this.currentRound.roundNumber,
        results,
      });

      this.horsePositions = Array(10).fill(0);
      this.horseSpeeds = Array(10).fill(0);
      this.finishTimes = Array(10).fill(null);
      this.raceStartTime = null;

      this.finishRound();
    },

    stopRace() {
      clearInterval(this.raceInterval);
      this.isRacing = false;
      this.horsePositions = Array(10).fill(0);
      this.horseSpeeds = Array(10).fill(0);
      this.finishTimes = Array(10).fill(null);
      this.raceStartTime = null;
      this.raceInterval = null;
    },

    resetTrack() {
      const track = this.$refs.track;
      if (track) {
        const horses = track.querySelectorAll(".horse");
        horses.forEach((horse) => {
          horse.style.left = "0px";
        });
      }
    },
  },

  watch: {
    raceStatus: {
      immediate: true,
      handler(newStatus) {
        if (newStatus === "racing") {
          this.startRace();
        } else if (newStatus === "paused" || newStatus === "idle") {
          this.stopRace();
        }
      },
    },
    raceStarted(newVal) {
      if (!newVal) {
        this.resetTrack();
      }
    },
  },
};
</script>

<style scoped>
.race-track {
  border: 1px solid #ccc;
  background: #f0f0f0;
  padding: 20px;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.track {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
}

.lane {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.lane-number {
  width: 30px;
  text-align: center;
  font-weight: bold;
  background: #4a7;
  color: white;
  padding: 5px;
}

.lane-track {
  flex-grow: 1;
  height: 40px;
  border: 1px dashed #999;
  position: relative;
}

.horse {
  position: absolute;
  width: 40px;
  height: 30px;
  top: 50%;
  transform: translateY(-50%);
  transition: left 0.1s linear;
}

.track-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #333;
  font-weight: bold;
}

.finish-line {
  color: red;
}
</style>
