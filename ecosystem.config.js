module.exports = {
  apps : [
    {
      "name": "backend",
      "cwd": "./backend",
      "script": "npm",
      "args": "start"
  },
  {
    "name": "frontend",
    "cwd": "./gfp",
    "script": "expo",
    "args": "start --android"
}
  ],
};
