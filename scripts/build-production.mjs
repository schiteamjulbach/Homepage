import {rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const buildDirectory=join(projectRoot,'.next');
// Only generated Next.js output is removed; never application data or uploads.
if(dirname(buildDirectory)!==projectRoot)throw new Error('Invalid build directory');
rmSync(buildDirectory,{recursive:true,force:true});
const result=spawnSync(process.execPath,[join(projectRoot,'node_modules/next/dist/bin/next'),'build'],{cwd:projectRoot,stdio:'inherit'});
if(result.error)throw result.error;
process.exit(result.status??1);
