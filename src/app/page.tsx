"use client";

import { User } from "@prisma/client";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<string[]>([
    "Password must be 3 characters or more",
  ]);
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
      setUser((prevState) => ({
        ...prevState,
        id: 0,
        login: "",
        email: "",
        password: "",
      }));
      console.log("GetUsers->res.data: ", res.data);
    }
  };

  useEffect(() => {
    GetUsers();
  }, []);

  function validateInputs(): boolean {
    const validationErrors: string[] = [];

    if (user.login.length < 1) {
      validationErrors.push("Login can't be empty");
    }
    if (user.email.length < 1) {
      validationErrors.push("Email can't be empty");
    }
    if (user.password.length < 3) {
      validationErrors.push("Password must be 3 characters or more");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return false;
    }

    return true;
  }

  const AddUser = async (e: MouseEvent<HTMLButtonElement>) => {
    setErrors([]);

    if (!validateInputs()) return;

    e.preventDefault();

    const resp = await axios.post("/api/users", {
      login: user.login,
      email: user.email,
      password: user.password,
    });

    if (resp && resp.data) {
      console.log("AddUser->resp.data: ", resp.data);
      GetUsers();
    }
  };

  const UpdateUser = async (e: MouseEvent<HTMLButtonElement>) => {
    setErrors([]);

    if (!validateInputs()) return;

    e.preventDefault();

    const resp = await axios.put("/api/users/", {
      id: user.id,
      login: user.login,
      email: user.email,
      password: user.password,
    });

    if (resp && resp.data) {
      console.log("UpdateUser->resp.data: ", resp.data);
      GetUsers();
    }
  };

  const ResetUser = () => {
    setUser((prevState) => ({
      ...prevState,
      id: 0,
      login: "",
      email: "",
      password: "",
    }));
  };

  const EditUser = (userId: number) => {
    const userFound = users.find((user) => user.id === userId);
    if (userFound) {
      setUser(userFound);
    }
  };

  const DeleteUser = async (userId: number, deleteConfirm: boolean) => {
    user.id = userId;
    (window as any).deleteModal.showModal();
    if (!deleteConfirm) {
      ResetUser();
      return;
    }
    const resp = await axios
      .delete("/api/users", {
        params: { id: userId },
      })
      .catch((error) => {
        console.log("catch: ", error.message);
      });

    if (resp && resp.data) {
      GetUsers();
    }
  };

  const CancelEdit = () => {
    ResetUser();
  };

  // Update specific input field
  const HandleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  return (
    <main>
      <h1>Users</h1>
      <div>
        <div>
          <div>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>

            <form>
              <input
                onChange={HandleChange}
                value={user.login}
                type="text"
                name="login"
                required
                placeholder="Login"
              />
              <input
                onChange={HandleChange}
                value={user.email}
                type="email"
                name="email"
                required
                placeholder="Email"
              />
              <input
                onChange={HandleChange}
                value={user.password}
                type="password"
                name="password"
                required
                placeholder="Password"
                minLength={3}
              />
              <div>
                <button
                  type="submit"
                  disabled={user.id > 0 ? true : false}
                  onClick={AddUser}
                >
                  Add
                </button>
                <button
                  type="submit"
                  disabled={user.id < 1 ? true : false}
                  onClick={UpdateUser}
                >
                  Update
                </button>
                <button
                  type="submit"
                  disabled={user.id < 1 ? true : false}
                  onClick={CancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Login</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: User) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.login}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => EditUser(user.id)}>
                        <FaPenToSquare />
                      </button>
                      <button onClick={() => DeleteUser(user.id, false)}>
                        <FaTrashCan />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog id="deleteModal" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>
          <h3 className="text-lg font-bold">Delete</h3>
          <p className="py-4">Are you sure you want to delete this user?</p>
          <div className="modal-action">
            <button
              onClick={() => DeleteUser(user.id, true)}
              className="btn btn-primary"
            >
              Yes
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
