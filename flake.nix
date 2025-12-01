{
  description = "diogocastro.net";

  inputs = {
    nixpkgs.url = "https://channels.nixos.org/nixpkgs-unstable/nixexprs.tar.xz";
  };

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.stdenv.mkDerivation {
            pname = "diogocastro-website";
            version = "0.0.1";
            src = ./.;

            nativeBuildInputs = [ pkgs.tailwindcss_4 ];

            buildPhase = ''
              tailwindcss -i globals.css -o styles.css --minify
            '';

            installPhase = ''
              mkdir -p $out
              cp index.html $out/
              cp styles.css $out/
            '';
          };
        }
      );

      nixosModules.default =
        {
          config,
          lib,
          pkgs,
          ...
        }:
        with lib;
        let
          cfg = config.services.diogocastro-website;
        in
        {
          options.services.diogocastro-website = {
            enable = mkEnableOption "Diogo Castro's personal website";

            domain = mkOption {
              type = types.str;
              default = "diogocastro.net";
              description = "Domain name for the website";
            };
          };

          config = mkIf cfg.enable {
            services.caddy = {
              enable = true;
              virtualHosts.${cfg.domain} = {
                serverAliases = [ "www.${cfg.domain}" ];
                extraConfig = ''
                  root * ${self.packages.${pkgs.system}.default}
                  file_server
                  encode gzip
                '';
              };
            };
          };
        };
    };
}
