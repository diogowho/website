{
  buildNpmPackage,
  importNpmLock,
  lib,
  nodejs,
}:
buildNpmPackage (finalAttrs: {
  pname = "diogocastro-website";
  version = "0.0.1";

  src = ../.;

  npmDeps = importNpmLock { npmRoot = ../.; };
  inherit (importNpmLock) npmConfigHook;

  nativeBuildInputs = [ nodejs ];

  env.ASTRO_TELEMETRY_DISABLED = 1;

  installPhase = ''
    runHook preInstall
    cp -r dist $out
    runHook postInstall
  '';

  meta = {
    description = "diogocastro.net";
    homepage = "https://diogocastro.net";
    license = with lib.licenses; [ zlib ];
  };
})
