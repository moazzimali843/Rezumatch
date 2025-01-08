// --------------- All wait functions here ---------------
// Function to wait for an element to appear on the page
function waitForElementForResumeAutomation(xpath, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const intervalDuration = 100; // Check every 100 ms
        const interval = setInterval(() => {
            let element;
            try {
                element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            } catch (error) {
                clearInterval(interval);
                reject(`Invalid XPath: "${xpath}". Error: ${error.message}`);
                return;
            }

            if (element) {
                clearInterval(interval);
                resolve(element); // Element found
            } else if (Date.now() - start >= timeout) {
                clearInterval(interval);
                reject(`Element with XPath "${xpath}" not found within ${timeout}ms`);
            }
        }, intervalDuration);
    });
}

// Function to wait for apply now button
function waitForApplyNowButton(xpath, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                clearInterval(interval);
                resolve(element);
            } else if (Date.now() - start >= timeout) {
                clearInterval(interval);
                resolve(null)
                // reject(`Element with XPath "${xpath}" not found within ${timeout}ms`);
            }
        }, 100);
    });
}

// Function to wait for three functions of Contact info page
function waitForElement(className, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const intervalDuration = 200; // Check every 200 ms
        const interval = setInterval(() => {
            const element = document.querySelector(className);
            if (element) {
                clearInterval(interval);
                resolve(element); // Element found
            } else if (Date.now() - start >= timeout) {
                clearInterval(interval);
                reject(`Element with CSS "${className}" not found within ${timeout}ms`);
            }
        }, intervalDuration);
    });
}

// A small deplay function
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// ---------------------------------------------------------


// ---------------- Action Functions here ----------------
// Function to click button by text
async function clickButtonByText(buttonText) {
    const xpath = `//button[.//text()[contains(., '${buttonText}')]]`;
    try {
        const button = await waitForElementForResumeAutomation(xpath);
        if (button) {
            button.click();
            console.log(`Clicked button with text: "${buttonText}"`);
            return true;
        }
    } catch (error) {
        console.error(`Error clicking button "${buttonText}":`, error);
        return false;
    }
}

// Function to click Apply now button at absolute start page
async function clickApplyNowButton(buttonText) {
    const xpath = `//button[.//text()[contains(., '${buttonText}')]]`;
    const button = await waitForApplyNowButton(xpath);
    if (button) {
        button.click();
        console.log(`Clicked button with text: "${buttonText}"`);
    }
}
// Function to start application procedure by clicking Apply now button
async function startApplication() {
    await clickApplyNowButton("Apply now");
}

// Fill first name on contact info page
async function ContactInfoFilling_firstName(firstNameValue) {
    const inputElement = '#input-firstName'; // Correctly scoped declaration
    try {
        const firstName = await waitForElement(inputElement); // Wait for the element
        if (firstName) {
            firstName.value = ''; // Clear the input field
            firstName.value = firstNameValue; // Set the new value

            // Dispatch an 'input' event to simulate user input
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            firstName.dispatchEvent(inputEvent);
        }
    } catch (error) {
        console.error('Error finding the first name input:', error); // Handle the error
    }
}

// Fill last name on contact info page
async function ContactInfoFilling_lastName(lastNameValue) {
    const inputElement = '#input-lastName'; // Correctly scoped declaration
    try {
        const lastName = await waitForElement(inputElement); // Wait for the element
        if (lastName) {
            lastName.value = ''; // Clear the input field
            lastName.value = lastNameValue; // Set the new value

            // Dispatch an 'input' event to simulate user input
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            lastName.dispatchEvent(inputEvent);
        }
    } catch (error) {
        console.error('Error finding the last name input:', error); // Handle the error
    }
}

// Fill City and Country on contact info page
// async function ContactInfoFilling_location (locationValue){
//     inputElement = '#input-location.city'
//     const location =await waitForElement(inputElement);
//     if (location) {
//         location.value = '';
//         location.value = locationValue;
        
//         // Dispatch an 'input' event to simulate user input
//         const inputEvent = new Event('input', { bubbles: true, cancelable: true });
//         location.dispatchEvent(inputEvent);
//     } else {
//         console.error('Location input not found!');
//     }
// }


// Main Function to fill personal detail on contact info page
async function fillContactInformationPage(firstName, lastName, location) {
    await ContactInfoFilling_firstName(firstName);
    await ContactInfoFilling_lastName(lastName);
    // await ContactInfoFilling_location(location);
    await clickButtonByText("Continue");
}

// Fill job title on relevant experience page
async function relevantExperienceFilling_jobTitle(jobTitleValue) {
    const inputElement = '#job-title-input'; // Correctly scoped declaration
    try {
        const jobTitle = await waitForElement(inputElement); // Wait for the element
        if (jobTitle) {
            jobTitle.value = ''; // Clear the input field
            jobTitle.value = jobTitleValue; // Set the new value

            // Dispatch an 'input' event to simulate user input
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            jobTitle.dispatchEvent(inputEvent);
        }
    } catch (error) {
        console.error('Error finding the job title input:', error); // Handle the error
    }
}

// Fill company name on relevant experience page
async function relevantExperienceFilling_companyName(companyNameValue) {
    const inputElement = '#company-name-input'; // Correctly scoped declaration
    try {
        const companyName = await waitForElement(inputElement); // Wait for the element
        if (companyName) {
            companyName.value = ''; // Clear the input field
            companyName.value = companyNameValue; // Set the new value

            // Dispatch an 'input' event to simulate user input
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            companyName.dispatchEvent(inputEvent);
        }
    } catch (error) {
        console.error('Error finding the company name input:', error); // Handle the error
    }
}

// Main Function to fill the relevant experience page
async function fillRelevantExperiencePage(jobTitle, companyName) {
    relevantExperienceFilling_jobTitle(jobTitle);
    relevantExperienceFilling_companyName(companyName);
    await clickButtonByText("Continue");
}

// Function to handle the extra questions page
async function fillExtraQuestionsPage(textareaValue) {
    try {
        const textarea = document.querySelector('textarea'); // Wait for the element
        if (textarea) {
            textarea.value = ''; // Clear the input field
            textarea.value = textareaValue; // Set the new value

            // Dispatch an 'input' event to simulate user input
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            textarea.dispatchEvent(inputEvent);
        }
    } catch (error) {
        console.error('Error finding the textarea input:', error); // Handle the error
    }
}

// Function to try cliking submit button and if not able, skip that job on extra questions page
async function tryClickContinueOrSkip() {
    let attempts = 0;
    let maxAttempts = 5;

    while (attempts < maxAttempts) {
        console.log(`Attempt ${attempts + 1} to click 'Continue'`);
        await clickButtonByText('Continue');
        
        // Wait for 1 second to ensure the page reacts to the click
        await delay(2000);

        // Check if the URL still ends with 'questions/1'
        if (!window.location.href.endsWith('questions/1')) {
            console.log('Successfully moved to a next page.');
            return; // Exit if the page has changed
        }

        attempts++;
    }

    // Send success message to background script
    chrome.runtime.sendMessage({ action: 'success' }, () => {
        console.log('Skipping this job due to extra questions.');

        // Close the current tab
        window.close(); // This will close the tab if the browser allows it
    });
}
// -------------------------------------------------------


// ------------------- Absolute main function -------------------
async function monitorURLChanges() {
    let lastURL = window.location.href; // Track the last URL

    // Function to handle each page flow based on the URL
    async function processPageFlow(currentURL) {
        console.log(`Processing URL: ${currentURL}`);

        try {
            if (currentURL.includes('viewjob')) {
                console.log('Starting application process...');
                await startApplication(); // Call specific function
            } 
            else if (currentURL.includes('contact-info')) {
                console.log('Filling contact information...');
                await fillContactInformationPage('Moazzim Ali', 'Bhatti', 'Islamabad, Pakistan'); // Call specific function
            } 
            else if (currentURL.includes('form/resume')) {
                console.log('Working on resume attaching...');
                console.log(window.location.href);
                await delay(5000); // Wait for 5 seconds
                await clickButtonByText('Continue');
            }
            else if (currentURL.includes('relevant-experience')) {
                console.log('Filling relevant experience...');
                await delay(5000); // Wait for 5 seconds
                await fillRelevantExperiencePage("AI Engineer", "Techtimize"); // Call specific function
            } 
            else if (currentURL.includes('questions/1')) {
                console.log('Filling extra questions...');
                await delay(5000); // Wait for 5 seconds
                await fillExtraQuestionsPage("Monday -- Friday\n9:00 AM -- 5:00 PM"); // Call specific function               
                // Function to try cliking submit button and if not able, skip that job
                await tryClickContinueOrSkip();
            } 
            else if (currentURL.endsWith('/review')) {
                console.log('Finalizing application...');
                await delay(5000); // Wait for 5 seconds
                await clickButtonByText('Submit your application');
                console.log('All steps completed in this job.');

                // Send success message to background script
                chrome.runtime.sendMessage({ action: 'success' }, () => {
                    console.log('Success message sent to background script.');
                });

                return false; // Stop monitoring
            }
            else if (currentURL.endsWith('form/intervention')) {
                // Send success message to background script
                chrome.runtime.sendMessage({ action: 'success' }, () => {
                    console.log('Skipping this job as it does not align with candidate expertise.');
                });
            }
            else {
                console.log('Unknown page. Waiting for next page...');
            }
        } catch (error) {
            console.error(`Error while processing URL ${currentURL}:`, error);

            // Send error message to background script
            chrome.runtime.sendMessage({ action: 'error', error: error.message }, () => {
                console.error('Error message sent to background script.');
            });
        }

        return true; // Continue monitoring
    }

    const observer = new MutationObserver(async () => {
        const currentURL = window.location.href;

        // Check if the URL has changed
        if (currentURL !== lastURL) {
            lastURL = currentURL;

            // Process the page flow for the new URL
            const continueMonitoring = await processPageFlow(currentURL);

            // Stop observing if the process is complete
            if (!continueMonitoring) {
                observer.disconnect();
            }
        }
    });

    // Observe changes to the URL in the document
    observer.observe(document.body, { childList: true, subtree: true });

    try {
        // Initial processing for the current URL
        await processPageFlow(lastURL);
    } catch (error) {
        console.error('Error during initial processing:', error);
        chrome.runtime.sendMessage({ action: 'error', error: error.message }, () => {
            console.error('Error message sent during initial processing.');
        });
    }
}

// Call the main function
monitorURLChanges();













// // ------------------- Absolute main function -------------------
// async function monitorURLChanges() {
//     let lastURL = window.location.href; // Track the last URL

//     // Function to handle each page flow based on the URL
//     async function processPageFlow(currentURL) {
//         console.log(`Processing URL: ${currentURL}`);
        
//         if (currentURL.includes('viewjob')) {
//             console.log('Starting application process...');
//             await startApplication(); // Call specific function
//         } 
//         else if (currentURL.includes('contact-info')) {
//             console.log('Filling contact information...');
//             await fillContactInformationPage('Azam', 'Bhatti', 'NY, USA'); // Call specific function
//         } 
//         else if (currentURL.includes('form/resume')) {
//             console.log('Working on resume attaching...');
//             console.log(window.location.href);
//             // await attachResume(); // Call specific function
//             await delay(5000); // Wait for 5 seconds
//             await clickButtonByText('Continue');
//         }
//         else if (currentURL.includes('relevant-experience')) {
//             console.log('Filling relevant experience...');
//             await delay(5000); // Wait for 5 seconds
//             await fillRelevantExperiencePage("ML Engineer","ML1"); // Call specific function
//             // await delay(5000); // Wait for 5 seconds
//             // await clickButtonByText('Continue');
//         } 
//         else if (currentURL.includes('questions/1')) {
//             console.log('Filling extra questions...');
//             await delay(5000); // Wait for 5 seconds
//             await fillExtraQuestionsPage(); // Call specific function
//             // await delay(5000); // Wait for 5 seconds
//             await clickButtonByText('Continue');
//         } 
//         else if (currentURL.endsWith('/review')) {
//             console.log('Finalizing application...');
//             await delay(5000); // Wait for 5 seconds
//             await clickButtonByText('Submit your application');
//             console.log('All steps completed in this job.');
//             return false; // Stop monitoring
//         }
//         else if (currentURL.endsWith('form/intervention')) {
//             console.log('Finalizing application...');
//             // await skippingJob(); // Call specific function
//             console.log('Skipping this job as it does not align with candidate expertise.');
//         }
//         else {
//             console.log('Unknown page. Waiting for next page...');
//         }
//         return true; // Continue monitoring
//     }

//     const observer = new MutationObserver(async () => {
//         const currentURL = window.location.href;

//         // Check if the URL has changed
//         if (currentURL !== lastURL) {
//             lastURL = currentURL;

//             // Process the page flow for the new URL
//             const continueMonitoring = await processPageFlow(currentURL);

//             // Stop observing if the process is complete
//             if (!continueMonitoring) {
//                 observer.disconnect();
//             }
//         }
//     });

//     // Observe changes to the URL in the document
//     observer.observe(document.body, { childList: true, subtree: true });

//     // Initial processing for the current URL
//     await processPageFlow(lastURL);
// }

// // Call the main function
// monitorURLChanges();