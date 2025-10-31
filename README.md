# github-review-shortcut

Mark file as "viewed" on GitHub PR UI when hovering and pressing 'Escape' key, with automatic navigation for efficient code review.

[Original discussion](https://github.com/orgs/community/discussions/10197)

## Features

- **Toggle viewed status**: Press any key while hovering over a file diff to mark it as viewed (or unmark if already viewed)
- **Automatic navigation**: In large pull request mode (where GitHub shows only one file at a time), automatically navigates to the next file ('j') when marking as viewed, or previous file ('k') when unmarking
- **Smart fallback**: If no file is under the cursor, automatically targets the first visible file in the viewport

## Instructions

1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension
2. Go to the [Greasyfork page](https://greasyfork.org/en/scripts/554359-github-pr-review-keyboard-shortcut)
3. Click 'Install this script'

## Usage

- Hover over any file diff and press any key to toggle its viewed status
- In large pull request mode (single file visible), the script will automatically navigate:
  - **Next file** when marking as viewed
  - **Previous file** when unmarking
