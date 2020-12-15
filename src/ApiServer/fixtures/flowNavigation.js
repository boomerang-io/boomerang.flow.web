export default [
  {
    name: "Workflows",
    type: "link",
    icon: "FlowData16",
    link: "/workflows",
  },
  {
    name: "Activity",
    type: "link",
    icon: "Activity16",
    link: "/activity",
  },
  {
    name: "Insights",
    type: "link",
    icon: "ChartScatter16",
    link: "/insights",
  },
  {
    name: "Management",
    type: "category",
    icon: "SettingsAdjust16",
    childLinks: [
      {
        name: "Team Properties",
        type: "link",
        link: "/team-properties",
      },
    ],
  },
  {
    name: "Admin",
    type: "category",
    icon: "Settings16",
    childLinks: [
      {
        name: "Teams",
        type: "link",
        link: "/admin/teams",
      },
      {
        name: "Users",
        type: "link",
        link: "/admin/users",
      },
      {
        name: "Properties",
        type: "link",
        link: "/admin/properties",
      },
      {
        name: "Quotas",
        type: "link",
        link: "/admin/quotas",
      },
      {
        name: "Settings",
        type: "link",
        link: "/admin/settings",
      },
      {
        name: "Task Manager",
        type: "link",
        link: "/admin/task-templates",
      },
    ],
  },
];
