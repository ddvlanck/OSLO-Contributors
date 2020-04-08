const git = require('simple-git/promise');
const rimraf = require('rimraf');
const shell = require('shelljs');

let processedRepositories = [];

class GitManager {

    stakeholdersFileHasChanged(repository){

    }

    repositoryAlreadyProcessed(repository){
        return processedRepositories.includes(repository);
    }

    async branchWasModified(){
        console.log(await git().diffSummary());
    }

    async fetchRepository(repository){
        processedRepositories.push(repository);
        const repositoryName = repository.substr(repository.lastIndexOf('/') + 1, repository.length);
        const localPath = '../repositories/' + repositoryName;

        // Fetch the repository
        /*git().silent(true).clone(repository, localPath)
            .then(() => console.log('Cloned repository ' + repositoryName))
            .catch( (error) => console.error(error));*/

        // TODO: this should be moved inside the 'then' above
        shell.cd('/bin');
        shell.cd(localPath);
        const branches = (await git().branch()).all;

        //TODO: for now this is okay
        // when all repositories are up and running another branch will be added: 'standaardenregister', and this branch can not be processed either
        // IN future we should depend on the branch tag in the publication file
        /*if(branches.length >= 3){
            for(let branch of branches){
                if(branch !== 'master' && branch !== 'remotes/origin/master'){
                    await git().checkout(branch);
                    this.branchWasModified()
                }
            }
        } else {
            git().checkout('master');
        }*/




        //git().checkout('master');

        // Delete repository again
        //rimraf('../repositories/' + repositoryName, () => console.log('Removed repository: ' + repositoryName));
    }

    processRepositoryBranch(repository, branch){

    }

    removeRepository(repository){

    }

}

module.exports = new GitManager;
