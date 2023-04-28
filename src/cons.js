const cons = {
  BASE_SERVER_URL: "http://localhost:8080",
  SECRETS: {
    ACCESS_TOKEN: null,
  },
  REGEXS: {
    VALID_EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  },
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
      text: "Admin"
    },
  },
  SIDEBARS: {
    ADMIN: {
      ADD_NEW_USER: {
        type: 'add-new-user',
        text: "Add new user"
      }
    }
  }
};

export default cons;
