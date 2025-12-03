# uuStarter

uuStarter is a crowdfunding platform clone inspired by well-known crowdfunding services.
It allows users to create campaigns, support projects, and track progress toward funding goals.

## 🚀 Getting Started
### clone repository
```
git clone https://github.com/evamasakova/UU-Projekt.git
```

### Install dependencies
```
npm i
```

### Run
```
npm run dev
```

Then the dev server should start and you are ready to go with your next move!

# For Devs

<i style="color : red">General Rule: Ask first and then do when something not clear.</i>

<i style="color : green">Important!🤮🤢 Do not be stinky... (just for test and fun - branch rules)</i>
## 🌱 Branching & Development Workflow

To maintain code quality and consistent delivery, we follow a structured branching workflow:

### Create a new branch for each feature or fix

Branch naming example:
* feature/add-project-page (adding new feature)
* fix/payment-validation   (fixing a feature that is already there but not coded right)

_or just descriptive name - above is **recommended**_

### then... when the code is ready and implemented

1. Open a Merge Request (MR) into the main branch
2. Assign a reviewer (team member or lead engineer)
3. Address review comments before approval (alternative but more time consuming version: fix it yourself and dont comment - less waiting for fix from author of MR)
4. dev branch merging - removed -> merge straight into main after confidently knowing its good code and ideally after review
5. All branches get merged here into main


Happen weekly or at the end of each sprint

## 📚 Commit Message Guidelines

Developers must follow the commit message and branching conventions described here:

https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716

This helps ensure a clean commit history and meaningful change logs.

## ✅ Code Review Expectations
* Code reviewers should check:
* Readability
* Correctness
* Security considerations
* Alignment with architecture and coding standards
* No direct commits to dev or main
## ‼️IF YOU HAVE ANY QUESTIONS OR STRUGGLES - WRITE TO DMS ON DISCORD

_Everytime you finish piece of code commit and push your work. After the task is ready to be reviewed create merge request and put someone as a reviewer - then pay attention to the review and rework mentioned parts if needed._

## Built on React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

#### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

#### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
