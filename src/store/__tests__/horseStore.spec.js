import { describe, it, expect, beforeEach, vi } from "vitest";
import horseStore from "../horseStore";
import { roundDistances } from "../../constants";

describe("horseStore", () => {
  let store;
  let state;
  let commit;

  beforeEach(() => {
    state = horseStore.state();
    commit = vi.fn();
  });

  describe("generateHorses action", () => {
    it("should generate 20 unique horses", async () => {
      await horseStore.actions.generateHorses({ commit, state });

      const generatedHorses = commit.mock.calls.find(
        (call) => call[0] === "setHorses"
      )[1];

      expect(generatedHorses).toHaveLength(20);

      generatedHorses.forEach((horse) => {
        expect(horse).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          condition: expect.any(Number),
          color: expect.any(String),
        });
      });
    });

    it("should generate horses with unique color", async () => {
      await horseStore.actions.generateHorses({ commit, state });

      const generatedHorses = commit.mock.calls.find(
        (call) => call[0] === "setHorses"
      )[1];
      const colors = new Set();

      generatedHorses.forEach((horse) => {
        expect(colors.has(horse.color)).toBe(false);
        colors.add(horse.color);
      });
    });

    it("should generate horses with condition values between 1 and 100", async () => {
      await horseStore.actions.generateHorses({ commit, state });

      const generatedHorses = commit.mock.calls.find(
        (call) => call[0] === "setHorses"
      )[1];

      generatedHorses.forEach((horse) => {
        expect(horse.condition).toBeGreaterThanOrEqual(1);
        expect(horse.condition).toBeLessThanOrEqual(100);
      });
    });
  });

  describe("generateProgram action", () => {
    beforeEach(async () => {
      await horseStore.actions.generateHorses({ commit, state });
      const generatedHorses = commit.mock.calls.find(
        (call) => call[0] === "setHorses"
      )[1];
      state.horses = generatedHorses;
      commit.mockClear();
    });

    it("should generate 6 rounds", async () => {
      const dispatch = vi.fn();
      await horseStore.actions.generateProgram({ commit, state, dispatch });

      const schedule = commit.mock.calls.find(
        (call) => call[0] === "setRaceSchedule"
      )[1];

      expect(schedule).toHaveLength(6);
    });

    it("should include correct round numbers and distances", async () => {
      const dispatch = vi.fn();
      await horseStore.actions.generateProgram({ commit, state, dispatch });

      const schedule = commit.mock.calls.find(
        (call) => call[0] === "setRaceSchedule"
      )[1];

      schedule.forEach((round, index) => {
        expect(round.roundNumber).toBe(index + 1);
        expect(round.distance).toBe(roundDistances[index]);
      });
    });

    it("should select 10 random horses from the available pool of 20 horses for each round", async () => {
      const dispatch = vi.fn();
      await horseStore.actions.generateProgram({ commit, state, dispatch });

      const schedule = commit.mock.calls.find(
        (call) => call[0] === "setRaceSchedule"
      )[1];

      const availableHorseIds = new Set(state.horses.map((h) => h.id));
      expect(availableHorseIds.size).toBe(20);

      schedule.forEach((round) => {
        expect(round.horses).toHaveLength(10);

        round.horses.forEach((horse) => {
          expect(availableHorseIds).toContain(horse.id);
        });

        const roundHorseIds = new Set(round.horses.map((h) => h.id));
        expect(roundHorseIds.size).toBe(10);
      });
    });

    it("should reset race results when generating new program", async () => {
      const dispatch = vi.fn();
      await horseStore.actions.generateProgram({ commit, state, dispatch });

      console.log("All commit calls:", commit.mock.calls);

      const hasResetResults = commit.mock.calls.some(
        ([mutation, payload]) =>
          (mutation === "setRaceResults" &&
            Array.isArray(payload) &&
            payload.length === 0) ||
          mutation === "clearRaceResults"
      );

      expect(hasResetResults).toBe(true);
    });

    it("should dispatch generateHorses when generating program", async () => {
      const dispatch = vi.fn();
      await horseStore.actions.generateProgram({ commit, state, dispatch });

      expect(dispatch).toHaveBeenCalledWith("generateHorses");
    });
  });

  describe("race control actions", () => {
    it("should start race with correct initial state", async () => {
      state.raceSchedule = [
        { roundNumber: 1, distance: 1000, horses: [] },
        { roundNumber: 2, distance: 1200, horses: [] },
      ];

      await horseStore.actions.startRace({ commit, state });

      expect(commit).toHaveBeenCalledWith(
        "setCurrentRound",
        state.raceSchedule[0]
      );
      expect(commit).toHaveBeenCalledWith("setRaceStatus", "racing");
    });

    it("should not start race if already racing", async () => {
      state.raceStatus = "racing";
      await horseStore.actions.startRace({ commit, state });

      expect(commit).not.toHaveBeenCalled();
    });

    it("should pause race correctly", async () => {
      await horseStore.actions.pauseRace({ commit });

      expect(commit).toHaveBeenCalledWith("setRaceStatus", "paused");
    });

    it("should finish race when all rounds complete", async () => {
      state.raceSchedule = [{ roundNumber: 1, distance: 1000, horses: [] }];
      state.currentRoundIndex = 1;
      const dispatch = vi.fn();
      await horseStore.actions.finishRound({ commit, state, dispatch });

      expect(commit).toHaveBeenCalledWith("setRaceStatus", "idle");
      expect(commit).toHaveBeenCalledWith("setCurrentRound", null);
    });
  });

  describe("race state getters", () => {
    it("should correctly determine if race is complete", () => {
      state.currentRoundIndex = 6;
      state.raceSchedule = Array(6).fill({});

      const isComplete = horseStore.getters.isRaceComplete(state);
      expect(isComplete).toBe(true);
    });

    it("should return race schedule", () => {
      const schedule = [
        { roundNumber: 1, distance: 1000 },
        { roundNumber: 2, distance: 1200 },
      ];
      state.raceSchedule = schedule;

      const result = horseStore.getters.getRaceSchedule(state);
      expect(result).toEqual(schedule);
    });
  });

  describe("race progression and results", () => {
    it("should add race results correctly", () => {
      const result = {
        roundNumber: 1,
        results: [
          { position: 1, id: 1, name: "Thunder Bolt" },
          { position: 2, id: 2, name: "Silver Storm" },
        ],
      };

      horseStore.mutations.setRaceResults(state, result);
      expect(state.raceResults).toContainEqual(result);
    });

    it("should clear race results and reset round index", () => {
      state.raceResults = [
        { roundNumber: 1, results: [] },
        { roundNumber: 2, results: [] },
      ];
      state.currentRoundIndex = 2;

      horseStore.mutations.clearRaceResults(state);

      expect(state.raceResults).toHaveLength(0);
      expect(state.currentRoundIndex).toBe(0);
    });

    it("should reset entire race state", () => {
      state.raceStarted = true;
      state.raceFinished = true;
      state.currentPositions = { 1: 50, 2: 75 };
      state.raceResults = [{ roundNumber: 1, results: [] }];
      state.elapsedTime = 1000;
      state.currentRound = { roundNumber: 1 };
      state.currentRoundIndex = 2;

      horseStore.mutations.resetRaceState(state);

      expect(state.raceStarted).toBe(false);
      expect(state.raceFinished).toBe(false);
      expect(state.currentPositions).toEqual({});
      expect(state.raceResults).toHaveLength(0);
      expect(state.elapsedTime).toBe(0);
      expect(state.currentRound).toBeNull();
      expect(state.currentRoundIndex).toBe(0);
    });

    it("should set race status to idle when generating new program", () => {
      state.raceStatus = "racing";

      horseStore.mutations.generateProgram(state);

      expect(state.raceStatus).toBe("idle");
    });

    it("should handle race status changes", () => {
      horseStore.mutations.setRaceStatus(state, "racing");
      expect(state.raceStatus).toBe("racing");

      horseStore.mutations.setRaceStatus(state, "paused");
      expect(state.raceStatus).toBe("paused");

      horseStore.mutations.setRaceStatus(state, "idle");
      expect(state.raceStatus).toBe("idle");
    });
  });
});
