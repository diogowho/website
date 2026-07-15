{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  packages = with pkgs; [ 
    just 
    nodejs 
    vtsls 
    astro-language-server 
    tailwindcss-language-server 
    prettierd 
    git-pages-cli
  ];
}

