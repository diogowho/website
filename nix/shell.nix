{
  mkShell,
  callPackage,
  nodejs,
  just,
  vtsls,
  astro-language-server,
  tailwindcss-language-server,
  prettierd,
}:
let
  mainPkg = callPackage ./package.nix { };
in
mkShell {
  inputsFrom = [ mainPkg ];

  packages = [
    nodejs
    just
    vtsls
    astro-language-server
    tailwindcss-language-server
    prettierd
  ];
}
