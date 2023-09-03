"use client";

import { User } from "@prisma/client";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
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

  const AddUser = async (e: MouseEvent<HTMLButtonElement>) => {
    setErrors([]);
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
      return;
    }

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
    if (user.login.length < 1) {
      setErrors((prevState) => [...prevState, "Login cant'n be empty"]);
      return;
    } else if (user.email.length < 1) {
      setErrors((prevState) => [...prevState, "Email cant'n be empty"]);
      return;
    } else if (user.password.length < 3) {
      setErrors((prevState) => [
        ...prevState,
        "Password must be 3 characters or more",
      ]);
      return;
    }
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

  const [checked, setChecked] = useState(false);

  return (
    <main className="flex w-screen flex-col items-center justify-center gap-4">
      <h1 className="mb-3 text-4xl font-bold">Users</h1>
      <div className="card border border-gray-200 bg-base-100 p-4 shadow-xl">
        <div className="flex gap-4 divide-x-2 divide-dotted">
          <div className="space-y-4">
            <ul>
              {errors.map((error, idx) => (
                <li className="text-red-500" key={idx}>
                  {error}
                </li>
              ))}
            </ul>

            <form className="flex flex-col gap-2">
              <input
                className="input input-bordered"
                onChange={HandleChange}
                value={user.login}
                type="text"
                name="login"
                required
                placeholder="Login"
              />
              <input
                className="input input-bordered"
                onChange={HandleChange}
                value={user.email}
                type="email"
                name="email"
                required
                placeholder="Email"
              />
              <input
                className="input input-bordered"
                onChange={HandleChange}
                value={user.password}
                type="password"
                name="password"
                required
                placeholder="Password"
                minLength={3}
              />
              <div className="space-x-2">
                <button
                  type="submit"
                  className="btn btn-primary disabled:bg-gray-600 disabled:text-gray-300"
                  disabled={user.id > 0 ? true : false}
                  onClick={AddUser}
                >
                  Add
                </button>
                <button
                  type="submit"
                  className="btn btn-accent disabled:bg-gray-600 disabled:text-gray-300"
                  disabled={user.id < 1 ? true : false}
                  onClick={UpdateUser}
                >
                  Update
                </button>
                <button
                  type="submit"
                  className="btn btn-primary disabled:bg-gray-600 disabled:text-gray-300"
                  disabled={user.id < 1 ? true : false}
                  onClick={CancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div className="w-1/2 overflow-auto ps-4">
            <table className="table">
              <thead>
                <tr className="table-head">
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
                    <td className="space-x-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => EditUser(user.id)}
                      >
                        <FaPenToSquare />
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => DeleteUser(user.id, false)}
                      >
                        <FaTrashCan />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* <div className="card scale-90 border border-gray-200 bg-base-100 p-4 shadow-xl transition duration-300 ease-in-out hover:scale-100 hover:border-gray-700 hover:shadow-2xl"> */}

            {/* {users.map((user: User, idx) => (
              <div key={user.id} className="my-card">
                <p>ID: {user.id}</p>
                <p>Login: {user.login}</p>
                <p>Email: {user.email}</p>
                {idx === 0 ? (
                  <p className="">
                    Description: Lorem, ipsum dolor sit amet consectetur
                    adipisicing elit. Fugiat distinctio a ipsam odit ab
                    consectetur necessitatibus, ea voluptatem accusantium, vel
                    amet quas numquam illo adipisci molestias! Culpa libero
                    saepe harum.
                  </p>
                ) : (
                  <p className="line-clamp-2">
                    Description: Lorem, ipsum dolor sit amet consectetur
                    adipisicing elit. Fugiat distinctio a ipsam odit ab
                    consectetur necessitatibus, ea voluptatem accusantium, vel
                    amet quas numquam illo adipisci molestias! Culpa libero
                    saepe harum. Description: Lorem, ipsum dolor sit amet
                    consectetur adipisicing elit. Fugiat distinctio a ipsam odit
                    ab consectetur necessitatibus, ea voluptatem accusantium,
                    vel amet quas numquam illo adipisci molestias! Culpa libero
                    saepe harum.
                  </p>
                )}
                <p>Created: {user.createdAt.toLocaleString()}</p>
                <p>Updated: {user.updatedAt.toLocaleString()}</p>
                <div className="flex gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => EditUser(user.id)}
                  >
                    <FaPenToSquare />
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => DeleteUser(user.id, false)}
                  >
                    <FaTrashCan />
                  </button>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* <div className="mx-auto max-w-md rounded bg-white p-4 shadow">
        <p className="break-words">
          ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp
        </p>
      </div>

      <div className="space-x-2">
        <label htmlFor="number">My number</label>
        <input className="appearance-none border" type="number" id="number" />
      </div>

      <div>
        <input
          type="checkbox"
          id="toggle-3"
          className="setting-toggle"
          checked={checked}
          name="newCourseVersion"
          readOnly
          onChange={() => setChecked(!checked)}
        />
        <label
          htmlFor="toggle-3"
          data-checked="ON"
          data-unchecked="OFF"
          className="toggle-label"
        ></label>
      </div>

      <div>
        <input type="text" placeholder="Search" />
        <button>search</button>
      </div> */}

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
