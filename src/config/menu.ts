export type MenuSubItemConfig = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

export type MenuItemConfig = {
  name: string;
  iconKey: string; // maps to an icon exported from src/icons/index.ts
  path?: string;
  subItems?: MenuSubItemConfig[];
};

// JSON-like config so it can be replaced by an API response later
export const MENU_CONFIG: MenuItemConfig[] = [
  {
    name: "Organization & Users",
    iconKey: "user-circle",
    subItems: [
      { name: "Manage Organization", path: "/organization/manage" },
      { name: "Manage Role", path: "/organization/roles" },
      { name: "Manage Menu", path: "/organization/menus" },
      { name: "Manage User", path: "/organization/users" },
    ],
  },
  {
    name: "Edge Management",
    iconKey: "box-cube",
    subItems: [
      { name: "Manage Edge Template", path: "/edge/templates" },
      { name: "Edge", path: "/edge" },
    ],
  },
  {
    name: "Asset Management",
    iconKey: "table",
    subItems: [
      { name: "Manage Asset Template", path: "/asset/templates" },
      { name: "Asset", path: "/asset" },
    ],
  },
];


