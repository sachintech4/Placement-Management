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
      VIEW_TPO: {
        type: "view-tpo",
        text: "View TPO",
      },
      VIEW_STUDENTS: {
        type: "view-students",
        text: "View Students",
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
      PLACEMENT_DRIVE_DETAILS: {
        type: "placement-drive-details",
        text: "Placement Drive Details",
      },
      LIST_OF_STUDENTS: {
        type: "list-of-students",
        text: "Students List",
      },
      PLACED_STUDENTS: {
        type: "placed-students",
        text: "Students Placed",
      },
      PLACEMENT_STATUS: {
        type: "placemeny-status",
        text: "Placement Status",
      },
      RECORDS: {
        type: "records",
        text: "Records",
      },
    },
    STUDENTS: {
      ACTIVE_PLACEMENTS: {
        type: "active-placements",
        text: "Active Placements",
      },
      PLACEMENTS_APPLIED_TO: {
        type: "placements-applied-to",
        text: "Placements Applied to",
      },
    },
  },
  DB: {
    COLLECTIONS: {
      USERS_ADMIN: "users_admin",
      USERS_STUDENT: "users_student",
      USERS_TPO: "users_tpo",
      COMPANIES: "companies",
      PLACEMENTS: "placements",
      RECORDS: "records",
      PLACEMENT_RECORDS: "placement_records",
    },
  },
};

export default cons;
