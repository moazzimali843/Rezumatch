const DOMUtils = {
    async findInput(fieldIdentifier, timeout = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            try {
                // Strategy 1: Find by name attribute
                let input = document.querySelector(`input[name="${fieldIdentifier}"]`);
                if (input) return input;

                // Strategy 2: Find by data-testid
                input = document.querySelector(`input[data-testid="input-${fieldIdentifier}"]`);
                if (input) return input;

                // Strategy 3: Find by ID
                input = document.querySelector(`input#input-${fieldIdentifier}`);
                if (input) return input;

            } catch (error) {
                console.log(`Attempt to find input "${fieldIdentifier}" failed:`, error);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        throw new Error(`Could not find input field: ${fieldIdentifier}`);
    },

    async fillInput(input, value) {
        if (!input) throw new Error('Input element is null or undefined');

        // Focus the input
        input.focus();

        // Set the value
        input.value = value;

        // Trigger necessary events to simulate user input
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
    },

    async findButtonByText(buttonText, timeout = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            try {
                // Strategy 1: Direct button text match
                const buttons = Array.from(document.querySelectorAll('button'));
                for (const button of buttons) {
                    if (button.textContent.trim().toLowerCase().includes(buttonText.toLowerCase())) {
                        return button;
                    }
                }

                // Strategy 2: Find by aria-label
                const ariaButton = document.querySelector(`button[aria-label*="${buttonText}"]`);
                if (ariaButton) return ariaButton;

                // Strategy 3: Find nested text and traverse up to button
                const textElements = Array.from(document.querySelectorAll('span, div'))
                    .filter(element =>
                        element.textContent.trim().toLowerCase().includes(buttonText.toLowerCase()) &&
                        window.getComputedStyle(element).display !== 'none'
                    );

                for (const element of textElements) {
                    const button = element.closest('button');
                    if (button) return button;
                }

            } catch (error) {
                console.log(`Attempt to find button with text "${buttonText}" failed:`, error);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        throw new Error(`Could not find button with text: ${buttonText}`);
    },

    async findSelectByLabelText(labelText, timeout = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            try {
                // Try finding by aria-label first
                let select = document.querySelector(`select[aria-label*="${labelText}"]`);
                if (select) return select;

                const textElements = Array.from(document.querySelectorAll('label, span, div'))
                    .filter(element =>
                        element.textContent.trim().toLowerCase().includes(labelText.toLowerCase()) &&
                        window.getComputedStyle(element).display !== 'none'
                    );

                for (const element of textElements) {
                    const container = element.closest('div[class*="select"], div[class*="field"], div[class*="form"]');
                    if (!container) continue;

                    select = container.querySelector('select');
                    if (select) return select;
                }

            } catch (error) {
                console.log(`Attempt to find select for "${labelText}" failed:`, error);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        throw new Error(`Could not find select element for label: ${labelText}`);
    },

    async waitForElementToBeInteractable(element, timeout = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            if (this.isElementVisible(element)) {
                // Additional check for overlaying elements
                const rect = element.getBoundingClientRect();
                const elementAtPoint = document.elementFromPoint(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2
                );

                if (element.contains(elementAtPoint) || elementAtPoint.contains(element)) {
                    return true;
                }
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        throw new Error('Element never became interactable');
    }
};




// Constants for configuration
const CONFIG = {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    PAGE_LOAD_TIMEOUT: 5000,
    ELEMENT_CHECK_INTERVAL: 500,
};

// Global automation control
let isAutomationActive = false;

// Application state management
const ApplicationState = {
    currentPage: null,
    isProcessing: false,
    lastProcessedURL: null,
    applicationData: {
        contactInfo: null,
        resumeAttached: false,
        experienceFilled: false,
    },
    reset() {
        this.currentPage = null;
        this.isProcessing = false;
        this.lastProcessedURL = null;
        this.applicationData = {
            contactInfo: null,
            resumeAttached: false,
            experienceFilled: false,
        };
    }
};

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'start_automation' && !isAutomationActive) {
//         isAutomationActive = true; // Prevent further processing
//         initializeURLMonitoring();
// chrome.runtime.sendMessage({ action: 'stop_retry' }); // Send acknowledgment to stop retries
//     }
// });



// chrome.runtime.sendMessage({ action: 'content_script_ready' });


// // Listen for messages from popup/background
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'start_automation') {

//         isAutomationActive = true;
//         initializeURLMonitoring();
//         console.log('Automation started');
//     }
//     else if (request.action === 'stop_automation') {
//         isAutomationActive = false;
//         stopURLMonitoring();
//         ApplicationState.reset();
//         console.log('Automation stopped');
//     }
//     return true;
// });



// Utility function for waiting for elements to appear
async function waitForElement(selector, timeout = CONFIG.PAGE_LOAD_TIMEOUT) {
    if (!isAutomationActive) return null;

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, CONFIG.ELEMENT_CHECK_INTERVAL));
    }

    throw new Error(`Timeout waiting for element: ${selector}`);
}

// Retry mechanism for operations
async function withRetry(operation, maxRetries = CONFIG.MAX_RETRIES) {
    if (!isAutomationActive) return;

    let lastError;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${i + 1} failed:`, error);
            if (i < maxRetries - 1) {
                await new Promise(resolve =>
                    setTimeout(resolve, CONFIG.RETRY_DELAY * Math.pow(2, i))
                );
            }
        }
    }

    throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError}`);
}



// URL monitoring handlers
let popstateListener = null;
let originalPushState = null;
let originalReplaceState = null;

function initializeURLMonitoring() {
    if (isAutomationActive) return;

    console.log("Initilaizaing auto.")
    // Store original history methods
    originalPushState = history.pushState;
    originalReplaceState = history.replaceState;
    isAutomationActive = true;
    // Listen for regular navigation
    console.log("hello")
    popstateListener = async function(event) {
        console.log("bye from popstate")
        if (isAutomationActive) {
            console.log("handleURL CHange")
            await handleURLChange();
        }
    };
    console.log("popState: ")
    window.addEventListener('popstate', popstateListener);

    // Intercept programmatic navigation
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        if (isAutomationActive) {
            handleURLChange();
        }
    };

    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        if (isAutomationActive) {
            handleURLChange();
        }
    };

    // Initial page check
    handleURLChange();
}


function stopURLMonitoring() {
    // Remove popstate listener
    if (popstateListener) {
        window.removeEventListener('popstate', popstateListener);
    }

    // Restore original history methods
    if (originalPushState) {
        history.pushState = originalPushState;
    }
    if (originalReplaceState) {
        history.replaceState = originalReplaceState;
    }

    // Reset listeners
    popstateListener = null;
    originalPushState = null;
    originalReplaceState = null;
}




// // URL monitoring and page detection
// function initializeURLMonitoring() {
//     // Listen for regular navigation
//     window.onpopstate = async function(event) {
//         await handleURLChange();
//     };

//     // Intercept programmatic navigation
//     const originalPushState = history.pushState;
//     history.pushState = function() {
//         originalPushState.apply(this, arguments);
//         handleURLChange();
//     };

//     const originalReplaceState = history.replaceState;
//     history.replaceState = function() {
//         originalReplaceState.apply(this, arguments);
//         handleURLChange();
//     };

//     // Initial page check
//     handleURLChange();
// }

// Page identification
function getCurrentPage() {
    const url = window.location.href;
    const pagePatterns = {
        'apply': '/viewjob',
        'contact-info': '/contact-info',
        'resume': '/resume',
        'relevant-experience': '/relevant-experience',
        'extra-questions': '/form/questions',
        'review': '/review',
        'work-experience': '/work-experience',
        'company-details': '/company-details'
    };

    for (const [page, pattern] of Object.entries(pagePatterns)) {
        if (url.includes(pattern)) return page;
    }
    return null;
}

// Main page change handler
async function handleURLChange() {
    if (isAutomationActive) return;

    // Prevent concurrent processing
    if (ApplicationState.isProcessing) {
        console.log('Already processing a page, skipping...');
        return;
    }

    const currentURL = window.location.href;

    // Skip if we've already processed this URL
    if (currentURL === ApplicationState.lastProcessedURL) {
        return;
    }

    try {
        ApplicationState.isProcessing = true;
        ApplicationState.currentPage = getCurrentPage();
        ApplicationState.lastProcessedURL = currentURL;

        console.log("Stage 2")
        await handlePageFlow();
    } catch (error) {
        console.error('Error handling URL change:', error);
    } finally {
        ApplicationState.isProcessing = false;
    }
}

// Main page flow handler
async function handlePageFlow() {
    if (!isAutomationActive) return;

    if (!ApplicationState.currentPage) {
        console.log('Unknown page, skipping...');
        return;
    }

    console.log("Stage 3 at" , ApplicationState.currentPage);

    try {
        switch (ApplicationState.currentPage) {
            case 'apply':
                await withRetry(startApplication);
                break;
            case 'contact-info':
                await withRetry(fillContactInformation);
                break;
            case 'resume':
                await withRetry(attachResume);
                break;
            case 'relevant-experience':
                await withRetry(fillRelevantExperience);
                break;
            case 'extra-questions':
                await withRetry(fillExtraQuestions);
                break;
            case 'review':
                await withRetry(reviewAndSubmit);
                break;
            default:
                console.log(`No handler for page: ${ApplicationState.currentPage}`);
        }
    } catch (error) {
        console.error(`Error processing ${ApplicationState.currentPage}:`, error);
        // You might want to implement some recovery logic here
    }
}

// Page-specific handlers
async function startApplication() {
    console.log("Starting application;")
    try {
        const applyButton = document.getElementById('indeedApplyButton')
        console.log(applyButton);
        // const applyButton = await DOMUtils.findButtonByText('Apply now');
        if (applyButton) {
            // await DOMUtils.waitForElementToBeInteractable(applyButton);
            applyButton.click();
        }
    } catch (error) {
        console.error('Error starting application process:', error);
        throw error;
    }
}

async function fillContactInformation() {
    try {
        // Find and fill first name
        const firstNameInput = await DOMUtils.findInput('firstName');
        await DOMUtils.fillInput(firstNameInput, 'John');

        // Find and fill last name
        const lastNameInput = await DOMUtils.findInput('lastName');
        await DOMUtils.fillInput(lastNameInput, 'Doe');

        // Find and fill city
        const cityInput = await DOMUtils.findInput('location.city');
        await DOMUtils.fillInput(cityInput, 'New York');

        const continueButton = await DOMUtils.findButtonByText('Continue');
        if (continueButton) {
            await DOMUtils.waitForElementToBeInteractable(continueButton);
            continueButton.click();
        }
    } catch (error) {
        console.error('Error filling personal info:', error);
        throw error;
    }
}

async function attachResume() {
    try {
        const continueButton = await DOMUtils.findButtonByText('Continue');
        if (continueButton) {
            await DOMUtils.waitForElementToBeInteractable(continueButton);
            continueButton.click();
        }
    } catch (error) {
        console.error('Error filling personal info:', error);
        throw error;
    }
}

async function fillRelevantExperience() {
    try {
        // Find and fill job title
        const jobTitleInput = await DOMUtils.findInput('jobTitle');
        await DOMUtils.fillInput(jobTitleInput, 'Software Engineer');

        // Find and fill company name
        const companyInput = await DOMUtils.findInput('companyName');
        await DOMUtils.fillInput(companyInput, 'Google');

        const continueButton = await DOMUtils.findButtonByText('Continue');
        if (continueButton) {
            await DOMUtils.waitForElementToBeInteractable(continueButton);
            continueButton.click();
        }
    } catch (error) {
        console.error('Error filling job and company:', error);
        throw error;
    }
}

async function fillExtraQuestions() {
    try {
        const continueButton = await DOMUtils.findButtonByText('Continue');
        if (continueButton) {
            await DOMUtils.waitForElementToBeInteractable(continueButton);
            continueButton.click();
        }
    } catch (error) {
        console.error('Error filling job and company:', error);
        throw error;
    }
}

async function reviewAndSubmit() {
    try {
        const submitButton = await DOMUtils.findButtonByText('Submit your application');
        if (submitButton) {
            await DOMUtils.waitForElementToBeInteractable(submitButton);
            submitButton.click();
        }

        // Finish for one job
        chrome.runtime.sendMessage({ action: 'content_script_done' });
    } catch (error) {
        console.error('Error filling job and company:', error);
        throw error;
    }
}

// // Initialize the automation
initializeURLMonitoring();
