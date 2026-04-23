export interface Preset {
  label: string;
  domain: string;
}

export const PRESETS: Record<string, Preset> = {
  // Google-verse
  google: { label: "Google Search", domain: "google.com" },
  gmail: { label: "Gmail", domain: "mail.google.com" },
  docs: { label: "Google Docs", domain: "docs.google.com" },
  sheets: { label: "Google Sheets", domain: "sheets.google.com" },
  slides: { label: "Google Slides", domain: "slides.google.com" },
  drive: { label: "Google Drive", domain: "drive.google.com" },
  calendar: { label: "Google Calendar", domain: "calendar.google.com" },
  meet: { label: "Google Meet", domain: "meet.google.com" },

  // Microsoft-verse
  outlook: { label: "Outlook", domain: "outlook.live.com" },
  teams: { label: "Microsoft Teams", domain: "teams.microsoft.com" },
  office: { label: "Office 365", domain: "office.com" },

  // Meetings
  zoom: { label: "Zoom", domain: "zoom.us" },

  // Chat / docs / tickets
  slack: { label: "Slack", domain: "slack.com" },
  notion: { label: "Notion", domain: "notion.so" },
  linear: { label: "Linear", domain: "linear.app" },
  jira: { label: "Jira", domain: "jira.atlassian.com" },
  confluence: { label: "Confluence", domain: "confluence.atlassian.com" },
  asana: { label: "Asana", domain: "asana.com" },
  trello: { label: "Trello", domain: "trello.com" },
  monday: { label: "Monday.com", domain: "monday.com" },
  clickup: { label: "ClickUp", domain: "clickup.com" },
  basecamp: { label: "Basecamp", domain: "basecamp.com" },

  // Code
  github: { label: "GitHub", domain: "github.com" },
  gitlab: { label: "GitLab", domain: "gitlab.com" },
  bitbucket: { label: "Bitbucket", domain: "bitbucket.org" },
  stackoverflow: { label: "Stack Overflow", domain: "stackoverflow.com" },
  chatgpt: { label: "ChatGPT", domain: "chatgpt.com" },
  claude: { label: "Claude", domain: "claude.ai" },

  // Design / whiteboards
  figma: { label: "Figma", domain: "figma.com" },
  miro: { label: "Miro", domain: "miro.com" },
  canva: { label: "Canva", domain: "canva.com" },

  // Files
  dropbox: { label: "Dropbox", domain: "dropbox.com" },
  airtable: { label: "Airtable", domain: "airtable.com" },

  // Business / CRM
  salesforce: { label: "Salesforce", domain: "salesforce.com" },
  hubspot: { label: "HubSpot", domain: "hubspot.com" },
  stripe: { label: "Stripe", domain: "stripe.com" },
  shopify: { label: "Shopify", domain: "shopify.com" },
  zendesk: { label: "Zendesk", domain: "zendesk.com" },
  linkedin: { label: "LinkedIn", domain: "linkedin.com" },
  aws: { label: "AWS Console", domain: "aws.amazon.com" },

  // Video / streaming
  youtube: { label: "YouTube", domain: "youtube.com" },
  vimeo: { label: "Vimeo", domain: "vimeo.com" },
  netflix: { label: "Netflix", domain: "netflix.com" },
  twitch: { label: "Twitch", domain: "twitch.tv" },
  spotify: { label: "Spotify", domain: "spotify.com" },

  // Social
  x: { label: "X (Twitter)", domain: "x.com" },
  reddit: { label: "Reddit", domain: "reddit.com" },
  instagram: { label: "Instagram", domain: "instagram.com" },
  facebook: { label: "Facebook", domain: "facebook.com" },
  tiktok: { label: "TikTok", domain: "tiktok.com" },

  // Shopping / misc
  amazon: { label: "Amazon", domain: "amazon.com" },
};
