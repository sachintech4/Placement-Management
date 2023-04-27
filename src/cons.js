const cons = {
  USERS: {
    TPO: {
      type: "tpo",
      text: "TPO"
    },
    STUDENT: {
      type: "student",
      text: "Student"
    },
    ADMIN: {
      type: "admin",
      text: "Admin",
    },
  },
  BASE_SERVER_URL: "http://localhost:8080",
  REGEXS: {
    VALID_EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  }
};

export default cons;
