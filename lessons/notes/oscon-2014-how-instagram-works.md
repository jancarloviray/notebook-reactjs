source: https://www.youtube.com/watch?v=VkTCL6Nqm6Y

Notes:

- CSS best practices (opinionated)
    - unambigous class names
    - no cascading, just a single classname selector only
    - no overriding properties... “oneClass twoClass threeClass”

- browserify builds large files
- instagram uses webpack
    https://github.com/webpack/webpack
    - it depends on dependency graph instead of building one big file
    - it allows you to split your codebase into multiple bundles which can be loaded in demands
