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

            nativeBuildInputs = [
              pkgs.nodejs
              pkgs.pnpm.configHook
            ];

            pnpmDeps = pkgs.pnpm.fetchDeps {
              pname = "diogocastro-website";
              version = "0.0.1";
              src = ./.;
              fetcherVersion = 2;
              hash = "sha256-hwI/NvTTuDwvbD32Yx23w+zu5nNLli+crP0aZwiJReg=";
            };

            env.ASTRO_TELEMETRY_DISABLED = 1;

            buildPhase = ''
              pnpm run build
            '';

            installPhase = ''
              mkdir -p $out
              cp -r dist/* $out/
            '';
          };
        }
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.nodejs
              pkgs.pnpm
              pkgs.just
            ];
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
                  root * ${self.packages.${pkgs.stdenv.hostPlatform.system}.default}
                  file_server
                  encode gzip
                '';
              };
            };
          };
        };
    };
}
