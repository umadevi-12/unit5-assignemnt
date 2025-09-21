export default {
  info: (...args) => console.log(new Date().toISOString(), "[info]:", ...args),
  error: (...args) => console.error(new Date().toISOString(), "[error]:", ...args),
};
