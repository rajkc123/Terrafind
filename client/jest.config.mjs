export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.scss$": "jest-css-modules-transform",
  },
  moduleFileExtensions: ["js", "jsx"],
};
