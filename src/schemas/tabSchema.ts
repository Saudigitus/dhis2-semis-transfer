import { atom } from "recoil";

export const TabsState = atom<"outgoing" | "incoming">({
  key: "transfer-tab-state",
  default: "outgoing",
});
