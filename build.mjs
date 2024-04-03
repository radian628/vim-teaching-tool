import * as esbuild from "esbuild";
import * as child_process from "node:child_process";
import { copy } from "esbuild-plugin-copy";

export const ctx = await esbuild.context({
  entryPoints: ["./src/main.tsx"],
  bundle: true,
  sourcemap: true,
  outdir: "./build",
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: [
        {
          from: ["./assets/**/*"],
          to: ["./build"],
        },
        {
          from: ["./node_modules/@picocss/pico/css/pico.classless.blue.css"],
          to: ["./build"],
        },
      ],
      watch: true,
    }),
  ],
});

await ctx.watch();
