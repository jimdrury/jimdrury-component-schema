import path from 'node:path';
import { Command } from 'commander';
import { applyPlan } from './apply';
import { discoverComponents } from './discover';
import { storyblokApi } from './env';
import { formatApplyResult, formatPlan } from './format';
import { computePlan } from './plan';

const program = new Command();

program
  .name('storyblok-schema')
  .description('Manage Storyblok components as code')
  .version('1.0.0');

const componentsDir = path.resolve(import.meta.dirname, '../components');

program
  .command('plan')
  .description('Preview changes that would be applied to your Storyblok space')
  .action(async () => {
    const localComponents = await discoverComponents(componentsDir);
    console.log(`Discovered ${localComponents.length} local component(s)`);
    console.log('Refreshing Storyblok state...');

    const plan = await computePlan(storyblokApi, localComponents);
    console.log(formatPlan(plan));
  });

program
  .command('apply')
  .description('Apply changes to your Storyblok space')
  .action(async () => {
    const localComponents = await discoverComponents(componentsDir);
    console.log(`Discovered ${localComponents.length} local component(s)`);
    console.log('Refreshing Storyblok state...');

    const plan = await computePlan(storyblokApi, localComponents);
    console.log(formatPlan(plan));

    if (plan.actions.length === 0) {
      return;
    }

    console.log('Applying...');
    console.log('');

    const result = await applyPlan(storyblokApi, plan);
    console.log(formatApplyResult(result));

    if (result.failed.length > 0) {
      process.exitCode = 1;
    }
  });

program.parse();
