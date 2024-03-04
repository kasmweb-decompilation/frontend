import { IS_ANONYMOUS } from "../../constants/Constants.js";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrip } from '@fortawesome/free-solid-svg-icons/faGrip';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons/faWindowRestore';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons/faAddressCard';
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons/faArrowCircleRight";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import { faDesktop } from "@fortawesome/free-solid-svg-icons/faDesktop";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";

const AdminUser = [
  {
    name: "Dashboard",
    authView: "reports",
    url: "/dashboard",
    icon: <FontAwesomeIcon className="tw-w-5 tw-h-5" icon={faGrip} />,
  },
  {
    name: "Access Management",
    url: "/access",
    icon: <FontAwesomeIcon className="tw-w-5 tw-h-5" icon={faAddressCard} />,
    children: [
      {
        name: "Users",
        authView: "users",
        url: "/adminUser",
      },
      {
        name: "Groups",
        authView: "groups",
        url: "/groups",
      },
      {
        name: "Authentication",
        url: "/authsection",
        children: [
          {
            name: "LDAP",
            authView: "auth",
            url: "/ldap",
          },
          {
            name: "SAML",
            authView: "auth",
            url: "/saml",
          },
          {
            name: "OpenID",
            authView: "auth",
            url: "/oidc",
          },
          {
            name: "Physical Tokens",
            authView: "physical_tokens",
            url: "/physical_tokens",
          }
        ],
      },
    ]
  },

  {
    name: "Infrastructure",
    url: "/infrastructure",
    icon: <FontAwesomeIcon className="tw-w-5 tw-h-5" icon={faGlobe} />,
    children: [
      {
        name: "Docker Agents",
        authView: "agents",
        url: "/agents",
      },
      {
        name: "Servers",
        authView: "servers",
        url: "/servers",
      },
      {
        name: "Pools",
        authView: "pools",
        url: "/server_pools",
      },
      {
        name: "Managers",
        authView: "managers",
        url: "/managers",
      },
      {
        name: "Zones",
        authView: "zones",
        url: "/zones",
      },
      {
        name: "Connection Proxies",
        authView: "connection_proxies",
        url: "/connection_proxies",
      },
    
    ]
  },

  {
    name: "Sessions",
    url: "/sessions",
    icon: <FontAwesomeIcon className="tw-w-5 tw-h-5" icon={faTable} />,
    children: [
      {
        name: "Sessions",
        authView: "sessions",
        url: "/kasm",
      },
      {
        name: "Session History",
        authView: "sessions",
        url: "/sessionhistory",
      },
      {
        name: "Staging",
        authView: "staging",
        url: "/staging",
      },
      {
        name: "Casting",
        authView: "casting",
        url: "/cast",
      },
    
    ]
  },
  {
    name: "Workspaces",
    url: "/workspacesection",
    icon: <FontAwesomeIcon className="tw-w-5 tw-h-5" icon={faWindowRestore} />,
    children: [
      {
        name: "Workspaces",
        authView: "images",
        url: "/workspaces",
      },
      {
        name: "Registry",
        authView: "registries",
        url: "/registry",
      },
    ]
  },

  {
    name: "Settings",
    url: "/settingsection",
    icon: <FontAwesomeIcon className="tw-w-5 tw-h-5" icon={faCog} />,
    children: [
      {
        name: "Global",
        authView: "settings",
        url: "/settings",
      },
      {
        name: "Web Filter",
        authView: "webfilter",
        url: "/webfilter",
      },
      {
        name: "Branding",
        authView: "branding",
        url: "/branding",
      },
      {
        name: "Storage",
        authView: "storage_providers",
        url: "/storage_providers",
      },    
      {
        name: "Developers",
        authView: "devapi",
        url: "/developers",
      },
    ]
  },

  {
    name: "Diagnostics",
    url: "/diagnostics",
    icon: <FontAwesomeIcon className="tw-w-5 tw-h-5" icon={faCode} />,
    children: [
      {
        name: "Logging",
        authView: "logging",
        url: "/logging",
      },
      {
        name: "System Info",
        authView: "system",
        url: "/systeminfo",
      },
    ]
  }

];

const anonymousUser = [
  {
    title: true,
    name: "USER",
  },
  {
    name: "Logout",
    url: "/logout",
    icon: <FontAwesomeIcon className="tw-w-5 tw-h-5" icon={faArrowRightFromBracket} />,
  },
];

export function routes() {
  return AdminUser
}

export default () => {
  if (IS_ANONYMOUS) {
    return anonymousUser;
  } else {
    return AdminUser;
  }
};
