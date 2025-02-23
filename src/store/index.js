import { createStore } from "vuex";
import horseStore from "./horseStore";

export default createStore({
  modules: {
    horse: horseStore,
  },
});
