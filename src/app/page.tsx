"use client";

import { User } from "@prisma/client";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({
    id: 0,
    login: "",
    email: "",
    password: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const GetUsers = async () => {
    const res = await axios.get("/api/users").catch((error) => {
      console.log("catch: ", error.message);
    });

    if (res && res.data) {
      setUsers(res.data.users);
      console.log("GetUsers->res.data: ", res.data);
    }
  };

  useEffect(() => {
    GetUsers();
  }, []);

  const addUser = async (e: SyntheticEvent) => {
    e.preventDefault();

    const resp = await axios.post("/api/users", {
      Login: user.login,
      Email: user.email,
      Password: user.password,
    });

    if (resp && resp.data) {
      console.log("AddUser->resp.data: ", resp.data);
      GetUsers();
    }

    ResetUser();
  };

  const UpdateUser = async (e: SyntheticEvent) => {
    e.preventDefault();

    const resp = await axios.put("/api/users/", {
      Id: user.id,
      Login: user.login,
      Email: user.email,
      Password: user.password,
    });

    if (resp && resp.data) {
      console.log("UpdateUser->resp.data: ", resp.data);
      GetUsers();
    }

    ResetUser();
  };

  const ResetUser = () => {
    setUser((prevState) => ({
      ...prevState,
      Id: 0,
      Login: "",
      Email: "",
      Password: "",
    }));
  };

  const EditUser = async (userId: number) => {
    const userFound = users.find((user) => user.id === userId);
    if (userFound) {
      setUser(userFound);
    }
  };

  const DeleteUser = async (userId: number) => {
    const resp = await axios
      .delete("/api/users", {
        params: { Id: userId },
      })
      .catch((error) => {
        console.log("catch: ", error.message);
      });

    if (resp && resp.data) {
      GetUsers();
    }
  };

  // Update specific input field
  const HandleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  return (
    <main>
      <h1>Users</h1>
      <form>
        <input
          onChange={HandleChange}
          value={user.login}
          type="text"
          name="Login"
          placeholder="Login"
        />
        <br />
        <input
          onChange={HandleChange}
          value={user.email}
          type="email"
          name="Email"
          placeholder="Email"
        />
        <br />
        <input
          onChange={HandleChange}
          value={user.password}
          type="password"
          name="Password"
          placeholder="Password"
        />
        <br />
        <div>
          <button onClick={addUser}>Add User</button>
          <button onClick={UpdateUser}>Update User</button>
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Login</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.login}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>
                <button onClick={() => EditUser(user.id)}>Editar</button>
                <button onClick={() => DeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
