# 📊 Poll App

A modern web application for creating, publishing and answering polls with live results.

The project is built with **Angular** and uses **Supabase** as the backend and database.

> 🚧 **Project Status:** In Development
> This application is currently being developed and expanded.

---

## ✨ Features

### 📋 Surveys

* Create new surveys
* Add a title, description and category
* Optional expiration date
* Save surveys as drafts
* Publish surveys
* Display active surveys
* Filter surveys by category and status
* Automatically detect expired surveys

### ❓ Questions & Answers

Surveys can contain multiple questions.

Each question supports:

* Single-choice answers
* Multiple-choice answers
* Dynamic answer fields
* Adding and removing questions
* Adding and removing answers
* Up to 6 answers per question
* Form validation before publishing

New questions automatically start with two answer fields.

### 🗳️ Voting

Users can participate in published surveys and submit their answers.

Depending on the question type, users can select:

* one answer using radio buttons
* multiple answers using checkboxes

Responses are stored in the Supabase database.

### 📊 Live Results

Survey results are calculated dynamically.

The application displays:

* number of votes
* percentage per answer
* progress bars
* live result updates
* information when no answers have been submitted yet

Supabase Realtime is used to update results when new responses are submitted.

### ⏱️ Survey Expiration

Surveys can have an optional expiration date.

The application automatically determines whether a survey is still active.

Surveys without an expiration date are displayed as:

> **Ends never**

---

## 🛠️ Tech Stack

### Frontend

* Angular
* TypeScript
* HTML
* SCSS
* Angular Reactive Forms
* Angular Signals
* Angular Router

### Backend

* Supabase
* PostgreSQL
* Supabase REST API
* Supabase Realtime

---

## 🗄️ Database Structure

The application currently uses several related tables in Supabase.

```text
surveys
│
├── questions
│   │
│   └── answers
│
└── survey_responses
    │
    └── response_answers
```

### Surveys

Stores the general information about a survey.

Examples:

```text
id
name
description
category
end_date
is_active
is_published
```

### Questions

Questions belong to a survey.

```text
id
survey_id
question
allow_multiple_answers
```

### Answers

Possible answers belong to a question.

```text
id
question_id
answer
```

### Survey Responses

Every submitted survey creates a response.

```text
id
survey_id
```

### Response Answers

Stores the answers selected by the user.

```text
id
response_id
question_id
answer_id
```

---

## 🧩 Reactive Forms

The survey creation form is built completely with **Angular Reactive Forms**.

The structure roughly looks like this:

```text
surveyForm
│
├── name
├── endDate
├── category
├── description
├── isPublished
│
└── questions (FormArray)
    │
    └── question (FormGroup)
        │
        ├── question
        ├── allowMultipleAnswers
        │
        └── answers (FormArray)
            │
            └── answer
```

This allows questions and answers to be added or removed dynamically.

---

## 🚀 Getting Started

### Requirements

Make sure the following tools are installed:

* Node.js
* npm
* Angular CLI

Check your installations with:

```bash
node --version
npm --version
ng version
```

---

### Clone the repository

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd poll-app
```

Install the dependencies:

```bash
npm install
```

---

## ▶️ Development Server

Start the Angular development server:

```bash
npm start
```

or:

```bash
ng serve
```

Open:

```text
http://localhost:4200
```

The application automatically reloads when source files are changed.

---

## 🧪 Testing

Run the unit tests with:

```bash
npm test
```

or:

```bash
ng test
```

---

## 🏗️ Build

Create a production build with:

```bash
npm run build
```

or:

```bash
ng build
```

The production files will be generated inside the Angular output directory.

These files can then be deployed to a web server or hosting provider.

---

## 🔐 Supabase

The application uses Supabase for persistent data storage.

The frontend communicates with Supabase to:

* load surveys
* create surveys
* create questions and answers
* submit survey responses
* store selected answers
* retrieve voting results
* receive realtime updates

Database access should be protected using appropriate **Row Level Security (RLS)** policies.

Sensitive credentials such as service-role keys must never be committed to the repository.

---

## 🗺️ Planned Features

The project is still under active development.

Possible future features include:

* User authentication
* User accounts
* Survey administration
* Editing existing surveys
* Deleting surveys
* Improved realtime results
* Result visualizations
* Survey statistics
* Better mobile support
* Improved validation
* Sharing surveys
* QR codes for surveys
* Anonymous and authenticated voting
* Protection against duplicate voting

---

## 📱 Responsive Design

The application is designed to work on different screen sizes.

The survey view includes a responsive layout where results can be shown or hidden on smaller devices.

---

## 🎯 Project Goal

The goal of this project is to build a modern polling platform while learning and applying important Angular concepts in a real application.

The project currently focuses on:

* Angular component architecture
* TypeScript
* Interfaces
* Reactive Forms
* FormGroup
* FormControl
* FormArray
* Angular Signals
* Routing
* Services
* REST APIs
* Relational database structures
* Supabase
* Realtime data

---

## 👨‍💻 Author

**Thorben Schreyer**

This project is being developed as part of my practical Angular and web development learning journey.

---

## 📄 License

No license has been defined for this project yet.

All rights reserved.
