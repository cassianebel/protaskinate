import Link from "./Link";
import SignOut from "./SignOut";

const Home = ({ user }) => {
  return (
    <div className="w-full">
      {!user ? (
        <div className="flex flex-col items-center justify-center">
          <Link text="New here? Sign up!" link="/signup" style="primary" />
          <Link
            text="Already protaskanating? Sign in!"
            link="/signin"
            style="secondary"
          />
        </div>
      ) : (
        <div className="w-full p-6 lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="">
            <h2 className="text-2xl text-center m-4">Current Task</h2>
            <div className="bg-yellow-300 dark:bg-yellow-500 ps-4 my-6 rounded-md shadow-md">
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 p-4 border-2 dark:border-1 border-yellow-300 dark:border-yellow-500 rounded-lg">
                <h3 className="text-xl font-medium">
                  Task with a medium length title
                </h3>

                <p className="my-2 text-zinc-600 dark:text-zinc-400">
                  Task description with more details to help you accomplish the
                  task.
                </p>
                <div className="flex justify-between items-center">
                  <p className="font-light mt-2 shrink-0">Due: Feb 24</p>
                  <ul className="mt-3 flex flex-wrap justify-end gap-3">
                    <li className="inline-flex items-center bg-blue-200 dark:bg-blue-800 px-3 pb-1 rounded-full text-sm">
                      work
                    </li>
                    <li className="inline-block bg-green-200 dark:bg-green-800 px-3 pb-1 rounded-full text-sm">
                      tag two
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:order-first">
            <h2 className="text-2xl text-center m-4">To-Dos</h2>

            <div className="bg-orange-300 dark:bg-orange-500 ps-4 my-6 rounded-md shadow-md">
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 border-2 dark:border-1 border-orange-300 dark:border-orange-500 p-4 rounded-lg">
                <h3 className="text-xl font-medium">Task Title</h3>
                <p className="my-2 text-zinc-600 dark:text-zinc-400">
                  Task with a short description
                </p>
                <ul className="mt-3 flex flex-wrap justify-end gap-3">
                  <li className="inline-block bg-purple-200 dark:bg-purple-800 px-3 pb-1 rounded-full text-sm">
                    tag three
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-red-400 dark:bg-red-500 ps-4 my-6 rounded-md shadow-md">
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 border-2 dark:border-1 border-red-400 dark:border-red-500 p-4 rounded-lg">
                <h3 className="text-xl font-medium">
                  Task with a supercalifragilistic expialidoscious long title
                </h3>
                <ul className="mt-3 flex flex-wrap justify-end gap-3">
                  <li className="inline-block bg-teal-200 dark:bg-teal-800 px-3 pb-1 rounded-full text-sm">
                    tag four
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl text-center m-4">Completed Tasks</h2>

            <div className="bg-orange-300 dark:bg-orange-500 ps-4 my-6 rounded-md shadow-md opacity-50">
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 border-2 dark:border-1 border-orange-300 dark:border-orange-500 p-4 rounded-lg">
                <h3 className="text-xl font-medium">Task Title</h3>
                <p className="my-2 text-zinc-600 dark:text-zinc-400">
                  Task with a short description
                </p>
                <ul className="mt-3 flex flex-wrap justify-end gap-3">
                  <li className="inline-block bg-purple-200 dark:bg-purple-800 px-3 pb-1 rounded-full text-sm">
                    tag three
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-red-400 dark:bg-red-500 ps-4 my-6 rounded-md shadow-md opacity-50">
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 border-2 dark:border-1 border-red-400 dark:border-red-500 p-4 rounded-lg">
                <h3 className="text-xl font-medium">Task Title</h3>
                <ul className="mt-3 flex flex-wrap justify-end gap-3">
                  <li className="inline-block bg-teal-200 dark:bg-teal-800 px-3 pb-1 rounded-full text-sm">
                    tag four
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-300 dark:bg-yellow-500 ps-4 my-6 rounded-md shadow-md opacity-50">
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 border-2 dark:border-1 border-yellow-300 dark:border-yellow-500 p-4 rounded-lg">
                <h3 className="text-xl font-medium">Task Title</h3>
                <p className="my-2 text-zinc-600 dark:text-zinc-400">
                  Task description with more details to help you accomplish the
                  task.
                </p>
                <ul className="mt-3 flex flex-wrap justify-end gap-3">
                  <li className="inline-block bg-blue-200 dark:bg-blue-800 px-3 pb-1 rounded-full text-sm">
                    work
                  </li>
                  <li className="inline-block bg-green-200 dark:bg-green-800 px-3 pb-1 rounded-full text-sm">
                    tag two
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
