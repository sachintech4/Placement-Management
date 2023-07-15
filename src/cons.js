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
        icon: "UserAdd",
      },
      VIEW_TPO: {
        type: "view-tpo",
        text: "View TPO",
        icon: "UserEdit",
      },
      VIEW_STUDENTS: {
        type: "view-students",
        text: "View Students",
        icon: "UserEdit",
      },
    },
    TPO: {
      ADD_NEW_COMPANY: {
        type: "add-new-company",
        text: "New company",
        icon: "CollectionAdd",
      },
      SHOW_COMPANIES: {
        type: "show-companies",
        text: "Show Companies",
        icon: "ViewDetail",
      },
      ADD_NEW_PLACEMENT_DRIVE: {
        type: "add-new-placement-drive",
        text: "New Placement Drive",
        icon: "ExperienceAdd",
      },
      PLACEMENT_DRIVE_DETAILS: {
        type: "placement-drive-details",
        text: "Placement Drive Details",
        icon: "ViewList",
      },
      LIST_OF_STUDENTS: {
        type: "list-of-students",
        text: "Students List",
        icon: "FolderUser",
      },
      PLACED_STUDENTS: {
        type: "placed-students",
        text: "Students Placed",
        icon: "UserActivity",
      },
      PLACEMENT_STATUS: {
        type: "placemeny-status",
        text: "Placement Status",
        icon: "Artboard",
      },
      PLACEMENT_RECORDS: {
        type: "placement-records",
        text: "Placement Records",
        icon: "ViewStack",
      },
      RECORDS: {
        type: "records",
        text: "Records",
        icon: "DataUser",
      },
    },
    STUDENTS: {
      ACTIVE_PLACEMENTS: {
        type: "active-placements",
        text: "Active Placements",
        icon: "ExperienceAddTo",
      },
      PLACEMENTS_APPLIED_TO: {
        type: "placements-applied-to",
        text: "Placements Applied to",
        icon: "WebPages",
      },
      PLACEMENT_STATUS: {
        type: "placements-status",
        text: "Placement Status",
        icon: "Artboard",
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
