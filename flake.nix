{
  description = "diogocastro.net";

  inputs = {
    nixpkgs.url = "https://channels.nixos.org/nixpkgs-unstable/nixexprs.tar.xz";
  };

  outputs =
    { self, nixpkgs }:
    let
      inherit (nixpkgs) lib;

      forAllSystems =
        fn:
        lib.genAttrs [
          "x86_64-linux"
          "x86_64-darwin"
          "aarch64-linux"
          "aarch64-darwin"
        ] (system: fn (import nixpkgs { inherit system; }));
    in
    {
      packages = forAllSystems (pkgs: {
        default = self.packages.${pkgs.stdenv.hostPlatform.system}.diogocastro-website;
        diogocastro-website = pkgs.callPackage ./nix/package.nix { };
      });

      devShells = forAllSystems (pkgs: {
        default = pkgs.callPackage ./nix/shell.nix { };
      });
    };
}
