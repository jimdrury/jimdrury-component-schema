#!/usr/bin/env node
import path from 'node:path';
import { Command } from 'commander';
import { applyPlan } from './cli/apply';
import { discoverComponents } from './cli/discover';
import { loadEnv } from './cli/env';
import { formatApplyResult, formatPlan } from './cli/format';
import { computePlan } from './cli/plan';

const program = new Command();

program
  .name('storyblok-component-schema')
  .description('Manage Storyblok components as code')
  .version('0.1.0');

program
  .command('plan')
  .description('Preview changes that would be applied to your Storyblok space')
  .option('--dir <path>', 'Path to components directory', './components')
  .action(async (opts: { dir: string }) => {
    const componentsDir = path.resolve(opts.dir);
    const api = loadEnv();
    const localComponents = await discoverComponents(componentsDir);
    console.log(`Discovered ${localComponents.length} local component(s)`);
    console.log('Refreshing Storyblok state...');

    const plan = await computePlan(api, localComponents);
    console.log(formatPlan(plan));
  });

program
  .command('apply')
  .description('Apply changes to your Storyblok space')
  .option('--dir <path>', 'Path to components directory', './components')
  .action(async (opts: { dir: string }) => {
    const componentsDir = path.resolve(opts.dir);
    const api = loadEnv();
    const localComponents = await discoverComponents(componentsDir);
    console.log(`Discovered ${localComponents.length} local component(s)`);
    console.log('Refreshing Storyblok state...');

    const plan = await computePlan(api, localComponents);
    console.log(formatPlan(plan));

    if (plan.actions.length === 0) {
      return;
    }

    console.log('Applying...');
    console.log('');

    const result = await applyPlan(api, plan);
    console.log(formatApplyResult(result));

    if (result.failed.length > 0) {
      process.exitCode = 1;
    }
  });

program.parse();
