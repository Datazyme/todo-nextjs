import { Task } from "@/models/task";
import { remultNextApp } from "remult/remult-next";

const api = remultNextApp({
  entities: [Task]
});

export const { GET, PUT, POST, DELETE } = api;
