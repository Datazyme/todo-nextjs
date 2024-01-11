"use client";
import { Task } from "@/models/task";
import { useEffect, useState } from "react";
import { remult } from "remult";

const taskRepo = remult.repo(Task);

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    taskRepo
      .find({
        orderBy: {
          createdAt: "asc"
        },
        where: {
          completed: undefined
        }
      })
      .then(setTasks);
  }, []);
  return (
    <div>
      <h1>Todos {tasks.length}</h1>
      <main>
        <form>
          <input
            value={newTaskTitle}
            placeholder="What needs to be done>"
            onChange={(e) => setNewTaskTitle(e.target.value)}
          ></input>
        </form>
        {tasks.map((task) => {
          return (
            <div key={task.id}>
              <input type="checkbox" checked={task.completed}></input>
              <span>{task.title}</span>
            </div>
          );
        })}
      </main>
    </div>
  );
}
