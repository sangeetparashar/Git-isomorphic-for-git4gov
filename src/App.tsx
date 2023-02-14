import React from 'react';
import git, {GitAuth} from 'isomorphic-git';
import FS from '@isomorphic-git/lightning-fs';
import http  from 'isomorphic-git/http/web';
import logo from './logo.svg';
import './App.css';

let fs = new (FS as any)("fs");
const dir = '/';

const onAuth = async () => {

    // Prompt the user for their username and password
    const username = prompt('Username:');
    // password now equates to users inputting their Personal Access Token
    const password = "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";
    // Return the credentials as an object
    return {
      username,
      password,
    } as GitAuth;
}

async function clone(){
 await git.clone({
  fs,
  http,
  dir,
  onAuth,
  url: 'https://github.com/sangeetparashar/hear-life',
  corsProxy: 'https://cors.isomorphic-git.org',
  ref: 'master',
  singleBranch: true,
  depth: 10
});
}

async function getRepo() {
  clone();
  await fs.promises.readdir(dir);
  const result = await git.log({fs, dir});
  console.log(result);
}

const init = async (fs: any, dir: any) => {
  await git.init({fs, dir});
}

const add = async (fs: any, dir: any, filepath: any) => {
  // Add some files to the repository
  await git.add({ fs, dir, filepath });
}


const commit = async(fs: any, dir: any, message: any) => {
  // Add some files to the repository
  await git.commit({ fs, dir, message });
}

const push = async (fs: any, dir: any, remote: any, url: any, ref: any, token: any) => {
await git.push({
  fs,
  http,
  dir: dir,
  remote: remote,
  url: url,
  ref: ref,
  onAuth: () => ({ username: token }),
});
}

const createAndPushToGithub = async(dir: string, githubToken: string, owner: string, repo: string) => {
  // Initialize a new Git repository
  await git.init({ fs, dir });

  // Add some files to the repository
  fs.promises.writeFile(`${dir}/README.md`, 'file contents', (err: any) => {
    if (err)
      throw err;
    console.log('File written successfully');
  });

  await git.add({ fs, dir, filepath: 'README.md' });

    // Commit the changes
    await git.commit({
      fs,
      dir,
      message: 'Initial commit',
      author: {
        name: 'Your Name',
        email: 'your.email@example.com',
      },
    });

    // Create the remote repository on GitHub
    const githubApi = `https://api.github.com/user/repos`;
    const response = await fetch(githubApi, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: repo }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create the remote repository: ${await response.text()}`);
    }

    const remoteURL = `https://${githubToken}@github.com/${owner}/${repo}.git`;

    // Add the remote repository to the local repository
    await git.addRemote({
      fs,
      dir,
      remote: 'upstream',
      url: remoteURL,
    });

    // Push to the remote repository
    await git.push({
      fs,
      dir,
      url: remoteURL,
      ref: 'master',
      force: true,
      http,
    });

    console.log(`Successfully created and pushed to the remote repository at ${remoteURL}`);
  }

    function App() {
      createAndPushToGithub(`${dir}path-to-repo`, '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', 'sangeetparashar', 'test-isomorphic-git-02-09');
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      );
    }

export default App;


/*
const Git = require('isomorphic-git')
const {fs} = require('fs-extra')

async function createAndPushToGithub(dir, githubToken, owner, repo) {
  // Initialize a new Git repository
  await Git.init({ fs, dir })

  // Add some files to the repository
  await fs.writeFile(`${dir}/README.md`, '# My new repository\n')
  await Git.add({ fs, dir, filepath: 'README.md' })

  // Commit the changes
  await Git.commit({
    fs,
    dir,
    message: 'Initial commit',
    author: {
      name: 'Your Name',
      email: 'your.email@example.com',
    },
  })

  // Create the remote repository on GitHub
  const githubApi = `https://api.github.com/repos/${owner}/${repo}`
  const response = await nodeFetch(githubApi, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: repo }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create the remote repository: ${await response.text()}`)
  }

  const remote = `https://${githubToken}@github.com/${owner}/${repo}.git`

  // Add the remote repository to the local repository
  await Git.addRemote({
    fs,
    dir,
    remote,
    name: 'origin',
  })

  // Push to the remote repository
  await Git.push({
    fs,
    dir,
    remote,
    ref: 'master',
    force: true,
    http,
  })

  console.log(`Successfully created and pushed to the remote repository at ${remote}`)
}

createAndPushToGithub('/path/to/repo', '<GITHUB_TOKEN>', '<OWNER>', '<REPO>')
*/