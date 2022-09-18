const github = require('@actions/github');
const core = require('@actions/core');

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
            resolve(i.html_url)
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
