const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  const token = core.getInput('token');
  const octokit = github.getOctokit(token);

  const promises = [];
  promises.push(
    new Promise((resolve, reject) => {
      // octokit.rest.issues
        // .createMilestone({
        //   ...github.context.repo,
        //   title,
        //   due_on: date,
        // })
        // .then(({data}) => {
        //   resolve(data.html_url);
        // })
        // .catch(err => {
        //   if (!err.message.match(/already_exists/)) {
        //     reject(err);
        //   }
        // });
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
