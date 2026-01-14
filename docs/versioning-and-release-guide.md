#  Versioning and Releases

This document provides a complete guide to the versioning and release strategy for this monorepo. It is designed to be clear and concise, enabling any team member to understand and execute the release process.

---

## Part 1: The Core Concepts

### Why do we need this process?

1.  **To Stop "It works on my machine"**: By standardizing versions, we ensure that every developer is using the exact same code, which prevents bugs caused by dependency mismatches.
2.  **To Know What Changed**: Our `CHANGELOG.md` files will be automatically generated from our work. This means we can always see what new features, bug fixes, and breaking changes are in each new version.
3.  **To Release with Confidence**: This process is predictable and repeatable. It removes guesswork and makes creating new version tags a safe, routine task instead of a stressful event.

### What is Semantic Versioning (SemVer)?

It's a simple promise about what a version number means. Given a version `MAJOR.MINOR.PATCH`:
- **`MAJOR`**: Is for **breaking changes**. If we change this, other developers know they might need to change their code to adapt.
- **`MINOR`**: Is for **new features** that are backward-compatible. We've added something new, but nothing should break.
- **`PATCH`**: Is for **bug fixes** that are backward-compatible. We've fixed something that was broken, but nothing new has been added.

### What is "Changesets"?

Changesets is the tool that powers our workflow. It's a small command-line assistant that does two things:
1.  **Asks you to describe your changes**: When you've finished your work, you tell Changesets what you did. It saves this as a small file.
2.  **Turns those descriptions into a release**: When we're ready to release, it gathers up all those small files, updates the version numbers in `package.json`, and rebuilds the `CHANGELOG.md` files for us.

---

## Part 2: The Daily Workflow (For Every Developer)

This is the process every developer must follow for **every feature, bug fix, or chore**.

### Step 1: Create Your Branch

Always start by creating a branch from the `develop` branch.

```bash
# Make sure you have the latest code
git checkout develop
git pull origin develop

# Create your new branch
git checkout -b feature/my-new-feature
```

### Step 2: Do Your Work

Make all your code changes as you normally would.

### Step 3: Add a "Changeset" (Crucial Step!)

This is the most important new step. When you have finished your work and are ready to commit, you must tell the Changesets tool what you did.

1.  **Run the command:**
    ```bash
    pnpm changeset add
    ```

2.  **The tool will ask you questions:**
    -   **"Which packages did you change?"**: Use the arrow keys and spacebar to select all the apps or packages you worked on.
    -   **"Which packages should have a `major` bump?"**: You will almost **never** choose `major`. Only do this if you have made a breaking change.
    -   **"Which packages should have a `minor` bump?"**: Choose this if you added a **new feature**.
    -   **"Which packages should have a `patch` bump?"**: Choose this if you made a **bug fix**.
    -   **"What is a summary of your changes?"**: Write a clear, concise message that will appear in the changelog. This should be written for other developers to read.
        -   **Good Example:** `feat: Add user profile page with avatar upload.`
        -   **Bad Example:** `made some changes`

3.  **A new file is created**: The tool will generate a new markdown file in the `.changeset` directory. This file contains the information you just provided.

### Step 4: Commit and Push

Now, commit both your code changes and the new changeset file.

```bash
git add .
git commit -m "feat: your commit message here"
git push origin feature/my-new-feature
```

### Step 5: Create a Pull Request

Create a Pull Request from your feature branch to the `develop` branch. That's it! Your part is done. The changelog entry for your work is now "banked" and ready for the next release.

---

## Part 3: The Release Workflow (For the Release Manager)

This process is performed only when we are ready to create a new release. It should be done by a designated release manager.

### Step 1: Create a Release PR with the "Version Packages" Action

This action will gather all the changeset files that have been merged into `develop` and create a new Pull Request with the version bumps and updated changelogs.

1.  **Go to the "Actions" tab** in the GitHub repository.
2.  **Select the "Version Packages" workflow** from the list on the left.
3.  **Click the "Run workflow" button.** A dropdown will appear.
4.  **Keep the branch as `develop`** and click the green "Run workflow" button.

The action will now run. When it's finished, a new Pull Request will be automatically created. The title will be something like `"chore: update versions for next release"`.

### Step 2: Review and Merge the Release PR

1.  **Open the new Pull Request.**
2.  **Review the changes.** Check the `CHANGELOG.md` files to ensure they look correct.
3.  **Merge the Pull Request** into the `develop` branch.

### Step 3: Create and Push the Git Tag

Once the release PR is merged, you need to create a Git tag for the new version. This tag serves as a permanent, browsable marker for the release.

1.  **Find the version number**: Look at the `package.json` of one of the apps in the `develop` branch to see what the new version number is (e.g., `1.2.0`).
2.  **Create the tag on your local machine**:
    ```bash
    # Make sure you are on the develop branch with the latest changes
    git checkout develop
    git pull origin develop

    # Create an annotated tag (the -a flag is important)
    git tag -a v1.2.0 -m "Release version 1.2.0"
    ```
3.  **Push the tag to GitHub**:
    ```bash
    git push origin v1.2.0
    ```

### Step 4: Merge to `main` to Finalize the Release

The final step is to merge the release into the `main` branch to keep it up-to-date with the latest stable code.

1.  Create a Pull Request from `develop` to `main`.
2.  Title it `Release v1.2.0`.
3.  Review and merge the Pull Request.

The release is now complete! The new tag is available in GitHub, the changelogs are updated, and the `main` branch is synced with the latest release.