import { clickButtonByText, fillInputByLabel } from './helpers.js';

// Function to handle the apply page
async function startApplication() {
    await clickButtonByText("Apply now");
}

// Actually working function
// Here change the contact info by taking from user as input
// Function to handle the personal details page
async function fillContactInformationPage(firstname, lastName, location) {
    await fillInputByLabel("First Name", firstname);
    await fillInputByLabel("Last Name", lastName);
    await fillInputByLabel("City, State", location);
    await clickButtonByText("Continue");
}

// Function to handle the resume page
async function attachResume() {
    await clickButtonByText("Continue");
}

// Function to handle the relevant experience page
async function fillRelevantExperiencePage() {
    await fillInputByLabel("Job title", "Software Engineer");
    await fillInputByLabel("Company", "Tech Solutions Inc.");
    await clickButtonByText("Continue");
}

// Function to handle the extra questions page
async function fillExtraQuestionsPage() {
    await fillInputByLabel("dates and time ranges that you could do an interview", "Monday - Friday, 9am to 5pm", "textarea");
    await clickButtonByText("Continue");
}

// Final function to submit the application
async function finalizeAndSubmitApplication() {
    await clickButtonByText("Submit your application");
    console.log("Job application submitted successfully!");
}




// Function to handle the work experience page
async function fillWorkExperiencePage() {
    await fillInputByLabel("Company", "Tech Solutions Inc.");
    await fillInputByLabel("Position", "Software Engineer");
    await fillInputByLabel("Years of Experience", "5");
    await clickButtonByText("Continue");
}

// Function to handle the company details page
async function fillCompanyDetailsPage() {
    await fillInputByLabel("Company Name", "Software Engineer");
    await fillInputByLabel("Location", "San Francisco");
    await clickButtonByText("Continue");
}

