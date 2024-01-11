import { TasksController } from "@/components/TasksController";
import { Task } from "@/models/task";
import { remultNextApp } from "remult/remult-next";

const api = remultNextApp({
  entities: [Task],
  controllers: [TasksController]
});

export const { GET, PUT, POST, DELETE } = api;
