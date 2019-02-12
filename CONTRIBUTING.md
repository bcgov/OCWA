# Contributing to OCWA

We would love for you to contribute to OCWA and help make it even better than it is
today! As a contributor, here are the guidelines we would like you to follow:

- [Code of Conduct](#coc)
- [Questions or Problems](#question)
- [Issues and Bugs](#issue)
- [Feature Requests](#feature)
- [Submission Guidelines](#submit)
- [Coding Rules](#rules)
- [Commit Message Guidelines](#commit)

## <a name="coc"></a> Code of Conduct

Help us keep OCWA open and inclusive. Please read and follow our [Code of Conduct][coc].

## <a name="question"></a> Questions or Problems

While we use GitHub issues mainly for bug reports and feature request tracking, if you have a question about OCWA, feel free to create a new issue ticket.

## <a name="issue"></a> Found a Bug?

If you find a bug in the source code, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository][github]. Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?

You can *request* a new feature by [submitting an issue](#submit-issue) to our GitHub
Repository. If you would like to *implement* a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.

Please consider what kind of change it is:

- **Major Feature** first open an issue and outline your proposal so that it can be discussed. This will also allow us to better coordinate our efforts, prevent duplication of work, and help you to craft the change so that it is successfully accepted into the project.
- **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem could already exist and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs, we will systematically ask you to provide a minimal reproduction. Having a minimal reproducible scenario gives us a wealth of important information without going back & forth to you with additional questions.

A minimal reproduction allows us to quickly confirm a bug (or point out a coding problem) as well as confirm that we are fixing the right problem.

We will be insisting on a minimal reproduction scenario in order to save maintainers time and ultimately be able to fix more bugs. Interestingly, from our experience users often find coding problems themselves while preparing a minimal reproduction. We understand that sometimes it might be hard to extract essential bits of code from a larger code-base but we really need to isolate the problem before we can fix it.

Unfortunately, we are not able to investigate / fix bugs without a minimal reproduction, so if we don't hear back from you we are going to close an issue that doesn't have enough info to be reproduced.

You can file new issues by selecting from our [new issue templates](https://github.com/bcgov/OCWA/issues/new/choose) and filling out the appropriate issue template.

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/bcgov/OCWA/pulls) for an open or closed PR that relates to your submission. You don't want to duplicate effort.
1. Be sure that an issue describes the problem you're fixing, or documents the design for the feature you'd like to add. Discussing the design up front helps to ensure that we're ready to accept your work.
1. Fork the bcgov/OCWA repo.
1. Make your changes in a new git branch:

    ``` sh
    git checkout -b my-fix-branch develop
    ```

1. Create your patch, **including appropriate test cases**.
1. Follow our [Coding Rules](#rules).
1. Ensure that all test suites pass.
1. Commit your changes using a descriptive commit message that succinctly explains what the commit is meant to change.

    ``` sh
    git commit -a
    ```

- Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

1. Push your branch to GitHub:

    ``` sh
    git push origin my-fix-branch
    ```

1. In GitHub, send a pull request to `upstream:develop`.

- If we suggest changes then:
  - Make the required updates.
  - Re-run the OCWA test suites to ensure tests are still passing.
  - Rebase your branch and force push to your own GitHub repository (this will update your Pull Request):

    ``` sh
    git rebase master -i
    git push -f
    ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ``` sh
    git push origin --delete my-fix-branch
    ```

- Check out the develop branch:

    ``` sh
    git checkout develop -f
    ```

- Delete the local branch:

    ``` sh
    git branch -D my-fix-branch
    ```

- Update your master with the latest upstream version:

    ``` sh
    git pull --ff upstream develop
    ```

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes **should be tested** by one or more specs (unit-tests).
- All public API methods **should be documented**. We use the OpenAPI 3.0 specification.
- While we do not yet have a formal coding style guideline, please put in reasonable effort to continue matching the style of existing code.

## <a name="commit"></a> Commit Message Guidelines

Each commit should be written so that any developer reading it can understand what the commit changes are doing to the codebase. The commit message should be concise, brief, yet detailed enough to explain the work done. Whenever possible, the commits should also attempt to reference the issue it is addressing on our issue tracker.

### Style

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end
- Consider including the motivation for the change and contrast this with previous behavior

### Headers

- If the commit **reverts** a previous commit, the first line should begin with `revert: <hash>`, where the hash is the SHA of the commit being reverted.
- If the commit contains a **breaking change**, the first line should begin with `BREAKING CHANGE:` and then a description of the change.

[coc]: /CODE_OF_CONDUCT.md
[github]: https://github.com/bcgov/OCWA
