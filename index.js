const github = require('@actions/github');
const core = require('@actions/core');
const moment = require('moment');

async function run() {
  const token = core.getInput('token');
  const octokit = github.getOctokit(token);

  const promises = [];
  promises.push(
    new Promise((resolve, reject) => {
      octokit.rest.issues
        .listMilestones({
          ...github.context.repo,
        })
        .then(list => {
          resolve(list)
          // list.forEach(i => {
          //   // if (moment() < moment(i.due_on)) {
          //   //   return;
          //   // }
          //
          //   const milestone_number = i.id;
          //   const state = 'closed';
          //
          //   console.log(milestone_number)
          //   console.log(state)
          //
          //   octokit.rest.issues
          //     .updateMilestone({
          //       ...github.context.repo,
          //
          //       milestone_number,
          //       state
          //     });
          //
          //   resolve({milestone: i, now: moment(), due: moment(i.due_on)});
          // })
        })
        .catch(err => {
          reject(err);
        });
    })
  );

  const milestones = [];
  await Promise.all(promises).then(url => {
    milestones.push(url);
  });

  core.setOutput('milestones', milestones);
}

try {
  run();
} catch (err) {
  core.setFailed(err.message);
}
