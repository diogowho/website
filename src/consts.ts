export const SELF: { name: string; email: string } = {
  name: "Diogo Castro",
  email: "website@diogocastro.net",
};

export const SOCIALS: { name: string; href: string; icon?: string }[] = [
  {
    name: "GitHub",
    href: "https://github.com/diogowho",
    icon: "mdi:github",
  },
  {
    name: "Codeberg",
    href: "https://codeberg.org/diogocastro",
    icon: "devicon-plain:codeberg",
  },
  {
    name: "Mastodon",
    href: "https://hachyderm.io/@iz",
    icon: "mdi:mastodon",
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/profiles/76561198950840617",
    icon: "mdi:steam",
  },
  {
    name: "Signal",
    href: "https://signal.me/#eu/2JSyQqcN8dCMg6C2UNJMRtS2anY-fmu7mECRxzyKKdw9k_hhMFRHA4ZWvK-JtZva",
    icon: "arcticons:signal",
  },
  {
    name: "Matrix",
    href: "https://matrix.to/#/@iz:skji.org",
    icon: "simple-icons:matrix",
  },
  {
    name: "Last.fm",
    href: "https://www.last.fm/user/izlul",
    icon: "mdi:lastfm",
  },
  {
    name: "Email",
    href: `mailto:${SELF.email}`,
    icon: "mdi:email",
  },
];
