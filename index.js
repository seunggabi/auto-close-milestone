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
        .then(({data}) => {
          data.forEach(i => {
            if (moment() < moment(i.due_on)) {
              return;
            }

            const milestone_number = i.number;
            const state = 'closed';
            octokit.rest.issues
              .updateMilestone({
                ...github.context.repo,

                milestone_number,
                state
              });

            const tag_name = i.title
            octokit.rest.repos
              .createRelease({
                ...github.context.repo,

                tag_name
              })

            resolve({milestone: i, now: moment(), due: moment(i.due_on)});
          })
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
