export const SELF: { name: string; email: string } = {
  name: "Diogo Castro",
  email: "website@diogocastro.net",
};

export const SOCIALS: { name: string; href: string; icon?: string }[] = [
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
    href: "https://signal.me/#eu/fsBt9oTZ4lxcqA7hHvjot1ft2C91k6ysxLETTqMYf5VECufwnq9C_YlbMkIlQ4ra",
    icon: "arcticons:signal",
  },
  {
    name: "Matrix",
    href: "https://matrix.to/#/@iz:skji.org",
    icon: "simple-icons:matrix",
  },
  {
    name: "Email",
    href: `mailto:${SELF.email}`,
    icon: "mdi:email",
  },
];
