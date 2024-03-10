import { env } from '$env/dynamic/private';

export function getDynamicEnvVar(name: 'S3_KEY_ID' | 'S3_SECRET') {
	const envVar = env[name];
	if (!envVar) throw new Error(`${name} is not set in runtime environment`);
	return envVar;
}
