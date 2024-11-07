# Contributing to Fitness AI

Thank you for your interest in contributing to **Fitness AI**! This document outlines the guidelines and best practices to follow to ensure a smooth and consistent workflow for everyone on the team.

---

## 1. Branching and Pull Requests

- **Pull Requests Required for `main` Branch**:  
  All changes to the `main` branch must go through a pull request (PR). Direct commits to `main` are not allowed to maintain stability and quality in our production branch.

- **Review and Approval Process**:
  - Every pull request requires **at least 1 approval** before merging into `main`.
  - If new commits are added to an open PR, previous approvals are dismissed, ensuring all changes are reviewed.

- **Best Practices for Pull Requests**:
  - **Title and Description**: Use a clear, descriptive title and provide a summary of changes made. This helps reviewers understand the purpose of the PR quickly.
  - **Keep Branches Up-to-Date**: Merge any new updates from `main` into your feature branch regularly to minimize conflicts. GitHub will prompt you to update your branch if needed.

---

## 2. Merging Rules

Different merge strategies are available based on the type of changes in the pull request:

- **Merge Commit**:  
  Use this option if you want to keep a detailed history of all commits from the feature branch.

- **Squash and Merge**:  
  Recommended for most pull requests with multiple commits. This option combines all commits into a single commit, creating a cleaner commit history.

- **Rebase and Merge**:  
  Use this if you want to apply each commit from the feature branch individually without a merge commit. This keeps a linear history but should be used carefully to avoid conflicts.

---

## 3. Code Reviews

- Be constructive and specific in your feedback during code reviews to help improve code quality.
- Before approving a PR, ensure it has been rebased on the latest `main` branch to prevent merge conflicts.
- After merging, delete the branch if it is no longer needed to keep the repository organized.

---

## 4. General Best Practices

- **Focus on One Feature or Fix per Pull Request**:  
  Keeping each PR focused on a single feature or fix makes it easier to review and manage.

- **Documentation and Comments**:  
  Write clear comments for complex code, and update documentation if your changes impact existing functionality.

---

By following these guidelines, we can maintain a clean, consistent, and collaborative codebase. If you have any questions or suggestions for improving our workflow, please reach out.
