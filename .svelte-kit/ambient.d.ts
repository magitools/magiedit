
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const CSB: string;
	export const CSB_EXEC_ID: string;
	export const PITCHER_CLIENTS_WSS_PORT: string;
	export const npm_config_user_agent: string;
	export const SUPERVISOR_GROUP_NAME: string;
	export const NODE_VERSION: string;
	export const HOSTNAME: string;
	export const YARN_VERSION: string;
	export const npm_node_execpath: string;
	export const SHLVL: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const OLDPWD: string;
	export const npm_package_json: string;
	export const PERMISSION_WATCHER_VERSION: string;
	export const LC_CTYPE: string;
	export const FNM_ARCH: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const npm_config_engine_strict: string;
	export const npm_config_resolution_mode: string;
	export const COLOR: string;
	export const npm_config_metrics_registry: string;
	export const FNM_LOGLEVEL: string;
	export const FNM_VERSION_FILE_STRATEGY: string;
	export const VERSION: string;
	export const LOGNAME: string;
	export const PROJECT_GID: string;
	export const FNM_NODE_DIST_MIRROR: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const PNPM_VERSION: string;
	export const PITCHER_MANAGER_WSS_PORT: string;
	export const TERM: string;
	export const WORKSPACE_PATH: string;
	export const NPM_CONFIG_STORE_DIR: string;
	export const WATCHMAN_VERSION: string;
	export const PITCHER_BIN_PATH: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const YARN_CACHE_FOLDER: string;
	export const PITCHER_WORKSPACE_PATH: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const ZSH_DISABLE_COMPFIX: string;
	export const FNM_DIR: string;
	export const SUPERVISOR_ENABLED: string;
	export const npm_lifecycle_script: string;
	export const FNM_RESOLVE_ENGINES: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const PITCHER_API_BASE_URL: string;
	export const CSB_BASE_PREVIEW_HOST: string;
	export const PITCHER_ENV: string;
	export const DOCKER_HOST: string;
	export const SUPERVISOR_SERVER_URL: string;
	export const SUPERVISOR_PROCESS_NAME: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const NPM_CONFIG_CACHE: string;
	export const PWD: string;
	export const CODESANDBOX_HOST: string;
	export const FNM_MULTISHELL_PATH: string;
	export const npm_execpath: string;
	export const npm_config_global_prefix: string;
	export const npm_command: string;
	export const FNM_COREPACK_ENABLED: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		CSB: string;
		CSB_EXEC_ID: string;
		PITCHER_CLIENTS_WSS_PORT: string;
		npm_config_user_agent: string;
		SUPERVISOR_GROUP_NAME: string;
		NODE_VERSION: string;
		HOSTNAME: string;
		YARN_VERSION: string;
		npm_node_execpath: string;
		SHLVL: string;
		npm_config_noproxy: string;
		HOME: string;
		OLDPWD: string;
		npm_package_json: string;
		PERMISSION_WATCHER_VERSION: string;
		LC_CTYPE: string;
		FNM_ARCH: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		npm_config_engine_strict: string;
		npm_config_resolution_mode: string;
		COLOR: string;
		npm_config_metrics_registry: string;
		FNM_LOGLEVEL: string;
		FNM_VERSION_FILE_STRATEGY: string;
		VERSION: string;
		LOGNAME: string;
		PROJECT_GID: string;
		FNM_NODE_DIST_MIRROR: string;
		_: string;
		npm_config_prefix: string;
		PNPM_VERSION: string;
		PITCHER_MANAGER_WSS_PORT: string;
		TERM: string;
		WORKSPACE_PATH: string;
		NPM_CONFIG_STORE_DIR: string;
		WATCHMAN_VERSION: string;
		PITCHER_BIN_PATH: string;
		npm_config_node_gyp: string;
		PATH: string;
		YARN_CACHE_FOLDER: string;
		PITCHER_WORKSPACE_PATH: string;
		NODE: string;
		npm_package_name: string;
		ZSH_DISABLE_COMPFIX: string;
		FNM_DIR: string;
		SUPERVISOR_ENABLED: string;
		npm_lifecycle_script: string;
		FNM_RESOLVE_ENGINES: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		PITCHER_API_BASE_URL: string;
		CSB_BASE_PREVIEW_HOST: string;
		PITCHER_ENV: string;
		DOCKER_HOST: string;
		SUPERVISOR_SERVER_URL: string;
		SUPERVISOR_PROCESS_NAME: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		NPM_CONFIG_CACHE: string;
		PWD: string;
		CODESANDBOX_HOST: string;
		FNM_MULTISHELL_PATH: string;
		npm_execpath: string;
		npm_config_global_prefix: string;
		npm_command: string;
		FNM_COREPACK_ENABLED: string;
		INIT_CWD: string;
		EDITOR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
