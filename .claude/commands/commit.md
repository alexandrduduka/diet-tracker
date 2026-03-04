# Commit

Create a git commit for all current changes.

## Steps

1. Run `git status` and `git diff` to review what changed
2. Stage all relevant files (be specific — avoid `git add .` if there are unrelated files)
3. Write a commit message that:
   - Uses imperative mood: "Add", "Fix", "Update", "Remove" (not "Added", "Fixes")
   - Summarises the *why*, not just the *what*
   - Keeps the subject line under 72 characters
   - Adds a brief body if multiple things changed
4. Commit with the message and `Co-Authored-By: Claude <noreply@anthropic.com>` trailer
5. Run `git status` to confirm the commit succeeded

## Important

- Remote for this repo: `git@github-personal:alexandrduduka/diet-tracker.git`
- Do NOT run `git push` unless explicitly asked
- Do NOT amend existing commits — always create a new commit
- Do NOT use `--no-verify`

## Commit message template

```
<verb> <short summary>

<optional body: what changed and why>

Co-Authored-By: Claude <noreply@anthropic.com>
```
