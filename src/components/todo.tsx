"use client";
import { Task } from "@/models/task";
import { FormEvent, useEffect, useState } from "react";
import { UserInfo, remult } from "remult";
import { TasksController } from "./TasksController";
import { signIn, signOut, useSession } from "next-auth/react";

const taskRepo = remult.repo(Task);

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const session = useSession();

  useEffect(() => {
    remult.user = session.data?.user as UserInfo;
    if (session.status === "unauthenticated") signIn();
    else if (session.status === "authenticated")
      taskRepo
        .find({
          orderBy: {
            createdAt: "asc"
          },
          where: {
            completed: undefined
          }
        })
        .then((info) => setTasks(info));
  }, [session]);

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function setCompleted(task: Task, completed: boolean) {
    const updatedTask = await taskRepo.save({ ...task, completed });
    setTasks(tasks.map((t) => (t == task ? updatedTask : t)));
  }

  async function deleteTask(task: Task) {
    try {
      await taskRepo.delete(task);
      setTasks(tasks.filter((t) => t !== task));
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function setAllCompleted(completed: boolean) {
    TasksController.setAllCompleted(completed);
  }

  if (session.status !== "authenticated") return <></>;
  return (
    
    <div>
      <h1>Todos {tasks.length}</h1>
      <main>
        <div>
          <span>Hello {remult.user?.name}</span>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
        {taskRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={addTask}>
            <input
              value={newTaskTitle}
              placeholder="What is to be done?"
              onChange={(e) => setNewTaskTitle(e.target.value)}
            ></input>
            <button>Add</button>
          </form>
        )}
        {tasks.map((task) => {
          return (
            <div key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => setCompleted(task, e.target.checked)}
              ></input>
              <span>{task.title}</span>
              <button onClick={() => deleteTask(task)}>Delete</button>
            </div>
          );
        })}
        <div>
          <button onClick={() => setAllCompleted(true)}>
            Set all Completed
          </button>
          <button onClick={() => setAllCompleted(false)}>
            Set all UnCompleted
          </button>
        </div>
      </main>
    </div>
  );
}
