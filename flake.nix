{
  description = "Moopon - Premium Anime List Manager";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        packages = {
          default = self.packages.${system}.moopon;

          moopon = pkgs.stdenv.mkDerivation {
            pname = "moopon";
            version = "1.1.1";

            src = self;

            buildInputs = with pkgs; [
              nodejs_22
              electron
            ];

            nativeBuildInputs = with pkgs; [
              makeWrapper
              autoPatchelfHook
            ];

            buildPhase = ''
              cd moopon-desktop
              npm install
              npm run build
              npm exec electron-builder -- --linux AppImage
            '';

            installPhase = ''
              mkdir -p $out/bin
              cp moopon-desktop/release/*.AppImage $out/bin/moopon
              chmod +x $out/bin/moopon
            '';

            meta = with pkgs.lib; {
              description = "Moopon - Premium Anime List Manager";
              homepage = "https://github.com/wootempest/Moopon";
              license = licenses.mit;
              platforms = platforms.linux;
              mainProgram = "moopon";
            };
          };
        };

        devShells.default = pkgs.mkShell {
          name = "moopon";
          packages = with pkgs; [
            nodejs_22
            electron
          ];

          shellHook = ''
            cd moopon-desktop
            export ELECTRON_SKIP_BINARY_DOWNLOAD=1
            echo "========================================="
            echo " Moopon - Premium Anime List Manager"
            echo "========================================="
            echo ""
            echo "Development:"
            echo "  npm run electron:dev"
            echo ""
            echo "Build & Run:"
            echo "  nix build"
            echo "  ./result/bin/moopon"
            echo ""
            echo "Install to profile:"
            echo "  nix profile install .#moopon"
            echo ""
          '';
        };
      }
    );
}
