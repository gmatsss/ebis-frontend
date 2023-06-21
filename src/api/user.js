export const register = async (user) => {
  try {
    // REACT_APP_API_URL from.env
    const res = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/user/register`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    return await res.json();
  } catch (err) {
    throw new Error(`Cannot register user. ${err}`);
  }
};

export const login = async ({ email, password } = {}) => {
  //create a user object
  const user = { email, password };
  try {
    //REACT_APP_API_URL from.env
    const res = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/user/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    return await res.json();
  } catch (err) {
    throw new Error(`Cannot login user. ${err}`);
  }
};

export const logout = async () => {
  try {
    //REACT_APP_API_URL from.env
    const res = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/user/logout`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const getLoggedInUser = async () => {
  try {
    //REACT_APP_API_URL from.env
    const res = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/user/userlog`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return await res.json();
  } catch (err) {
    throw new Error(`Please login. ${err}`);
  }
};

export const get_size = async () => {
  try {
    //REACT_APP_API_URL from.env
    const res = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/user/g/size`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return await res.json();
  } catch (err) {
    throw new Error(` ${err}`);
  }
};
