import { javascript, typescript } from "projen";
import { NpmAccess } from "projen/lib/javascript";

const project = new typescript.TypeScriptProject({
  name: "@wisegpt/gpt-conversation-prompt",
  packageName: "@wisegpt/gpt-conversation-prompt",
  npmAccess: NpmAccess.PUBLIC,
  description:
    "Types and utility functions to easily generate OpenAI GPT prompts for chatting with the AI.",
  keywords: ["openai", "gpt", "conversation", "chat"],

  workflowNodeVersion: "18.x",

  license: "Unlicense",

  defaultReleaseBranch: "main",

  // TODO: enable after initial version
  github: false,
  release: false,

  packageManager: javascript.NodePackageManager.NPM,

  tsconfig: { compilerOptions: { skipLibCheck: true } },
  tsconfigDev: { compilerOptions: { skipLibCheck: true } },

  prettier: true,
  projenrcTs: true,
  repository: "https://github.com/wisegpt/gpt-conversation-prompt.git",

  peerDeps: ["openai"],
});

project.npmignore?.exclude(
  "/lib/internal/**",
  ".DS_Store",
  ".prettier*",
  "*.iml",
  ".projenrc.ts",
  ".git*"
);

project.synth();
