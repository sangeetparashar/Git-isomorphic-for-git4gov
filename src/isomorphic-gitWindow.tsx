import FS from '@isomorphic-git/lightning-fs';

export interface IsomorphicGitWindow extends Window {
    fs: FS;
    pfs: any;
    dir: any;

}