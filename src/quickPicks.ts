export interface QuickPick {
  preset: string;
  title: string;
}

export const QUICK_PICKS: QuickPick[] = [
  // Google Calendar — uh-oh meetings
  { preset: "calendar", title: "Sync with Manager" },
  { preset: "calendar", title: "Surprise Q3 Review" },
  { preset: "calendar", title: "Chat with HR" },
  { preset: "calendar", title: "Layoffs Planning" },

  // Google Search — panicked queries
  { preset: "google", title: "how to look busy at work" },
  { preset: "google", title: "can my boss see my screen" },
  { preset: "google", title: "acceptable reasons to call out sick" },
  { preset: "google", title: "symptoms of burnout" },
  { preset: "google", title: "how much PTO do I have left" },

  // Google Search — embarrassing medical
  { preset: "google", title: "itchy bum hole" },
  { preset: "google", title: "why do my farts smell like rotten eggs" },
  { preset: "google", title: "is it normal to have 3 nipples" },
  { preset: "google", title: "hemorrhoids or something worse" },
  { preset: "google", title: "strange lump near groin" },
  { preset: "google", title: "toe fungus home remedies" },
  { preset: "google", title: "why is my pee green" },

  // Netflix
  { preset: "netflix", title: "The Office" },
  { preset: "netflix", title: "Severance Season 2" },
  { preset: "netflix", title: "Office Space 1999" },

  // YouTube
  { preset: "youtube", title: "how to appear productive" },
  { preset: "youtube", title: "10 hours of rain sounds" },
  { preset: "youtube", title: "asmr keyboard typing" },
  { preset: "youtube", title: "minecraft speedrun WR" },

  // Embarrassing media consumption
  { preset: "youtube", title: "anime big boys" },
  { preset: "youtube", title: "cute cat videos 10 hours" },
  { preset: "youtube", title: "how to flirt with confidence" },
  { preset: "youtube", title: "bronies explained" },
  { preset: "netflix", title: "Twilight Saga Eclipse" },
  { preset: "netflix", title: "My Little Pony Friendship is Magic" },
  { preset: "spotify", title: "Disney Princess Sing Along" },
  { preset: "tiktok", title: "gentle parenting for adults" },

  // Stack Overflow
  { preset: "stackoverflow", title: "how to exit vim" },
  { preset: "stackoverflow", title: "why is my code not working" },
  { preset: "stackoverflow", title: "undefined is not a function" },

  // Gmail
  { preset: "gmail", title: "Inbox 4287 unread" },
  { preset: "gmail", title: "Re URGENT please respond" },
  { preset: "gmail", title: "LinkedIn 50 new jobs for you" },

  // Docs
  { preset: "docs", title: "Resignation Letter Draft" },
  { preset: "docs", title: "Resume FINAL v47" },
  { preset: "docs", title: "Performance Self Review" },

  // AI
  { preset: "chatgpt", title: "rewrite this email to sound confident" },
  { preset: "chatgpt", title: "write excuse for being late" },
  { preset: "claude", title: "explain git rebase like im 5" },

  // Work chatter
  { preset: "linkedin", title: "Software Engineer jobs near me" },
  { preset: "slack", title: "DM from your manager" },

  // Tickets, meetings, wiki
  { preset: "jira", title: "Critical bug in production" },
  { preset: "zoom", title: "All Hands 2pm" },
  { preset: "notion", title: "Quarterly OKRs" },
  { preset: "confluence", title: "Onboarding Checklist" },
];
