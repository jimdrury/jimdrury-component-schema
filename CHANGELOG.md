# Changelog

## [0.5.0](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.4.6...storyblok-component-schema-v0.5.0) (2026-03-21)


### Features

* add pluginCodeBlock field type ([#29](https://github.com/jimdrury/jimdrury-component-schema/issues/29)) ([4c96116](https://github.com/jimdrury/jimdrury-component-schema/commit/4c961165a4d2b436b9a47179e852314698a3f25f))

## [0.4.6](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.4.5...storyblok-component-schema-v0.4.6) (2026-03-21)


### Bug Fixes

* remove duplicate fs import in CLI entrypoint ([#27](https://github.com/jimdrury/jimdrury-component-schema/issues/27)) ([27ec089](https://github.com/jimdrury/jimdrury-component-schema/commit/27ec089795406e4fb4c058d30c3e715abcf546b8))
* support schema-first discovery and extensionless imports ([#25](https://github.com/jimdrury/jimdrury-component-schema/issues/25)) ([ddd7a4e](https://github.com/jimdrury/jimdrury-component-schema/commit/ddd7a4ed10ba2a1b43764d2315c92ed4e36133ab))
* support schema-first discovery and push lint checks ([#26](https://github.com/jimdrury/jimdrury-component-schema/issues/26)) ([cdb6732](https://github.com/jimdrury/jimdrury-component-schema/commit/cdb67325decf44d26d390d96807de88db3c34e78))

## [0.4.5](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.4.4...storyblok-component-schema-v0.4.5) (2026-03-20)


### Documentation

* add skill files for all schema function types ([#21](https://github.com/jimdrury/jimdrury-component-schema/issues/21)) ([89758f2](https://github.com/jimdrury/jimdrury-component-schema/commit/89758f2f8ca797098ddcbb7271e74f72aa8a6194))


### Miscellaneous

* add Claude Code plugin marketplace manifest ([#22](https://github.com/jimdrury/jimdrury-component-schema/issues/22)) ([c84bf7f](https://github.com/jimdrury/jimdrury-component-schema/commit/c84bf7fca5b177ae99abce6743514a63a61baa90))


### CI

* include docs and chore commits in releases ([#23](https://github.com/jimdrury/jimdrury-component-schema/issues/23)) ([dbaf655](https://github.com/jimdrury/jimdrury-component-schema/commit/dbaf655dc1eba3029cbdaf2616684b48f357f524))

## [0.4.4](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.4.3...storyblok-component-schema-v0.4.4) (2026-03-20)


### Bug Fixes

* unwrap double-wrapped default export from tsImport ([#19](https://github.com/jimdrury/jimdrury-component-schema/issues/19)) ([d8d3171](https://github.com/jimdrury/jimdrury-component-schema/commit/d8d3171d09e3eec32befb738c004c26d9e39f359))

## [0.4.3](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.4.2...storyblok-component-schema-v0.4.3) (2026-03-20)


### Bug Fixes

* use global tsx register with native import for component loading ([#17](https://github.com/jimdrury/jimdrury-component-schema/issues/17)) ([60c2c75](https://github.com/jimdrury/jimdrury-component-schema/commit/60c2c756fe48a7fbdf2aaa5cc52da1460317c4ab))

## [0.4.2](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.4.1...storyblok-component-schema-v0.4.2) (2026-03-20)


### Bug Fixes

* use component file path as parentURL for tsImport resolution ([#15](https://github.com/jimdrury/jimdrury-component-schema/issues/15)) ([17260c6](https://github.com/jimdrury/jimdrury-component-schema/commit/17260c68f238ae6679415966eadce7f751c8c3c7))

## [0.4.1](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.4.0...storyblok-component-schema-v0.4.1) (2026-03-20)


### Bug Fixes

* guard against undefined schema in plan and payload ([9456781](https://github.com/jimdrury/jimdrury-component-schema/commit/94567812b12cebcd5cd066a772f4e2b335a21d6d))
* guard against undefined schema in plan and payload ([49d6ba2](https://github.com/jimdrury/jimdrury-component-schema/commit/49d6ba2c25bc2c2134aa51298c8a081cba4af64e))

## [0.4.0](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.3.0...storyblok-component-schema-v0.4.0) (2026-03-20)


### Features

* add .component-schema.yaml config file support ([95a48ba](https://github.com/jimdrury/jimdrury-component-schema/commit/95a48bac4a897b8f1b5765f2d421d108c0608afd))
* add .component-schema.yaml config file support ([6f2f816](https://github.com/jimdrury/jimdrury-component-schema/commit/6f2f816c08291aedc715d22a673f2dbd6c4cd8b1))
* add install skill and fix dotenv loading order ([38c3fba](https://github.com/jimdrury/jimdrury-component-schema/commit/38c3fbaef20282db2909685490ebfbf052741cd6))
* adds some base component types ([ed154ed](https://github.com/jimdrury/jimdrury-component-schema/commit/ed154edf567e3344968ff3c86816d09308cbc99f))
* adds some base component types ([d5bd405](https://github.com/jimdrury/jimdrury-component-schema/commit/d5bd405106509063664f3017b6462baecfa5fdaa))
* initial build ([d3e92cd](https://github.com/jimdrury/jimdrury-component-schema/commit/d3e92cd6d23f6f22e85425e3541b825b7de48516))
* initial commit of schema based storyblok components ([dc798a3](https://github.com/jimdrury/jimdrury-component-schema/commit/dc798a34dedac411837af5eab767e889e36a88eb))
* updates ci to run tests in main, and pin node version to lts 24 ([ca5ef20](https://github.com/jimdrury/jimdrury-component-schema/commit/ca5ef201da7c9e66462f537c93058b53a40c5c53))
* updates ci to run tests in main, and pin node version to lts 24 ([6652f7e](https://github.com/jimdrury/jimdrury-component-schema/commit/6652f7e78b47aa353f318c0203707f9c56189d88))
* use tsx for self-contained TypeScript loading in CLI ([907c584](https://github.com/jimdrury/jimdrury-component-schema/commit/907c584edbc31c410e9cde9b908090084fcb8800))


### Bug Fixes

* apply running on pr workflow ([e6a6b82](https://github.com/jimdrury/jimdrury-component-schema/commit/e6a6b82de2592965fa975269c63ce7b58592f2eb))
* **ci:** handle missing Storyblok credentials gracefully ([80a76f1](https://github.com/jimdrury/jimdrury-component-schema/commit/80a76f109aeabc49e1dc01c6e97077f9d8ddae12))
* **ci:** read STORYBLOK_SPACE_ID from vars instead of secrets ([63cf1b7](https://github.com/jimdrury/jimdrury-component-schema/commit/63cf1b79506751e38e2cc6a48b54a75e9f42cc9e))
* suppress MODULE_TYPELESS_PACKAGE_JSON warning in CLI ([bd61ac9](https://github.com/jimdrury/jimdrury-component-schema/commit/bd61ac9a261834745f393ba947a1d504b9eed300))

## [0.3.0](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.2.0...storyblok-component-schema-v0.3.0) (2026-03-20)


### Features

* add .component-schema.yaml config file support ([95a48ba](https://github.com/jimdrury/jimdrury-component-schema/commit/95a48bac4a897b8f1b5765f2d421d108c0608afd))
* add .component-schema.yaml config file support ([6f2f816](https://github.com/jimdrury/jimdrury-component-schema/commit/6f2f816c08291aedc715d22a673f2dbd6c4cd8b1))
* add install skill and fix dotenv loading order ([38c3fba](https://github.com/jimdrury/jimdrury-component-schema/commit/38c3fbaef20282db2909685490ebfbf052741cd6))
* use tsx for self-contained TypeScript loading in CLI ([907c584](https://github.com/jimdrury/jimdrury-component-schema/commit/907c584edbc31c410e9cde9b908090084fcb8800))


### Bug Fixes

* suppress MODULE_TYPELESS_PACKAGE_JSON warning in CLI ([bd61ac9](https://github.com/jimdrury/jimdrury-component-schema/commit/bd61ac9a261834745f393ba947a1d504b9eed300))

## [0.2.0](https://github.com/jimdrury/jimdrury-component-schema/compare/storyblok-component-schema-v0.1.0...storyblok-component-schema-v0.2.0) (2026-03-20)


### Features

* adds some base component types ([ed154ed](https://github.com/jimdrury/jimdrury-component-schema/commit/ed154edf567e3344968ff3c86816d09308cbc99f))
* adds some base component types ([d5bd405](https://github.com/jimdrury/jimdrury-component-schema/commit/d5bd405106509063664f3017b6462baecfa5fdaa))
* initial build ([d3e92cd](https://github.com/jimdrury/jimdrury-component-schema/commit/d3e92cd6d23f6f22e85425e3541b825b7de48516))
* initial commit of schema based storyblok components ([dc798a3](https://github.com/jimdrury/jimdrury-component-schema/commit/dc798a34dedac411837af5eab767e889e36a88eb))
* updates ci to run tests in main, and pin node version to lts 24 ([ca5ef20](https://github.com/jimdrury/jimdrury-component-schema/commit/ca5ef201da7c9e66462f537c93058b53a40c5c53))
* updates ci to run tests in main, and pin node version to lts 24 ([6652f7e](https://github.com/jimdrury/jimdrury-component-schema/commit/6652f7e78b47aa353f318c0203707f9c56189d88))


### Bug Fixes

* apply running on pr workflow ([e6a6b82](https://github.com/jimdrury/jimdrury-component-schema/commit/e6a6b82de2592965fa975269c63ce7b58592f2eb))
* **ci:** handle missing Storyblok credentials gracefully ([80a76f1](https://github.com/jimdrury/jimdrury-component-schema/commit/80a76f109aeabc49e1dc01c6e97077f9d8ddae12))
* **ci:** read STORYBLOK_SPACE_ID from vars instead of secrets ([63cf1b7](https://github.com/jimdrury/jimdrury-component-schema/commit/63cf1b79506751e38e2cc6a48b54a75e9f42cc9e))
