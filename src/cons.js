const cons = {
  BASE_SERVER_URL: "http://localhost:8080",
  SECRETS: {
    ACCESS_TOKEN: null,
  },
  REGEXS: {
    VALID_EMAIL:
      /^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  },
  USERS: {
    TPO: {
      type: "tpo",
      text: "TPO",
    },
    STUDENT: {
      type: "student",
      text: "Student",
    },
    ADMIN: {
      type: "admin",
      text: "Admin",
    },
  },
  SIDEBARS: {
    COMMON: {
      PROFILE_AND_SETTINGS: {
        type: "profile-and-settings",
        text: "Profile and Settings",
      },
      LOGOUT: {
        type: "logout",
        text: "Logout",
      },
    },
    ADMIN: {
      ADD_NEW_USER: {
        type: "add-new-user",
        text: "Add new user",
      },
    },
    TPO: {
      ADD_NEW_COMPANY: {
        type: "add-new-company",
        text: "New company",
      },
      SHOW_COMPANIES: {
        type: "show-companies",
        text: "Show Companies",
      },
      ADD_NEW_PLACEMENT_DRIVE: {
        type: "add-new-placement-drive",
        text: "New Placement Drive",
      },
      PLACEMENT_DETAILS: {
        type: "placement-details",
        text: "Placement Details",
      },
      LIST_OF_STUDENTS: {
        type: "list-of-students",
        text: "Students List",
      },
      PLACED_STUDENTS: {
        type: "placed-students",
        text: "Students Placed",
      },
      PLACEMENT_RECORDS: {
        type: "placement-records",
        text: "Placement Records",
      },
    },
  },
};

export default cons;
