// Everything personal about the site lives here.
// Replace the YOUR_... placeholders with your public usernames.

export const site = {
  name: "your name here",
  tagline: "things i've watched & things i've saved",

  // From letterboxd.com/<username>
  letterboxdUser: "YOUR_LETTERBOXD_USERNAME",

  // From pinterest.com/<username>
  pinterestUser: "YOUR_PINTEREST_USERNAME",
  // Optional: a board's URL slug (pinterest.com/<username>/<board>) to show only that board.
  // Leave empty to show your most recent pins across all boards.
  pinterestBoard: "",

  filmCount: 8,
  pinCount: 15,

  // How often to re-fetch the feeds, in seconds.
  refreshSeconds: 1800,
};

export function isPlaceholder(value: string) {
  return !value || value.startsWith("YOUR_");
}
