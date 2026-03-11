# AWS SSO Auto Accept

Chrome extension that automatically clicks **Allow** and **Confirm and continue** buttons on AWS SSO consent pages (`*.awsapps.com/start/*`).

Saves you from manually approving the same prompt every time you authenticate with AWS SSO.

## Install

1. Clone or download this repo
2. Open `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select this folder

## How it works

A content script runs on `*.awsapps.com/start/*` pages and watches for consent buttons using a `MutationObserver` + polling fallback. It handles both screens of the AWS SSO flow:

1. "Allow access to your data?" → clicks **Allow**
2. "Authorization requested" → clicks **Confirm and continue**
