let lastClickedUrl = null;
let clickCountOnSameScreen = 0;
// Helper function for clicking a button by text
// async function clickButtonByText(buttonText) {
//     const xpath = `//button[.//text()[contains(., '${buttonText}')]]`;
//     const button = await waitForElement(xpath);
//     if (button) {
//         button.click();
//         console.log(`Clicked button with text: "${buttonText}"`);
//     }
// }

async function pauseAutomation() {
    await chrome.storage.local.set({ isAutomationPaused: true });
    console.log('Automation paused');
}

async function resumeAutomation() {
    await chrome.storage.local.set({ isAutomationPaused: false });
    console.log('Automation resumed');
    // Restart the monitoring process
    monitorURLChanges();
}

// Helper function to check automation state
async function isAutomationPaused() {
    const result = await chrome.storage.local.get(['isAutomationPaused']);
    return result.isAutomationPaused || false;
}


async function clickButtonByText(buttonText) {
    const xpath = `//button[.//text()[contains(., '${buttonText}')]]`;
    try {
        const button = await waitForElement(xpath);
        if (button) {
            // Check if we're on the same URL as last click
            const currentUrl = window.location.href;
            
            if (currentUrl === lastClickedUrl) {
                clickCountOnSameScreen++;
                console.log(`Clicked continue ${clickCountOnSameScreen} times on same screen`);
                
                // If clicked more than once on same screen, skip to next job
                if (clickCountOnSameScreen > 2) {
                    console.log("Continue button clicked multiple times on same screen, skipping to next job");
                    await newJobApply();
                    return false;
                }
            } else {
                // Reset counter for new URL
                clickCountOnSameScreen = 1;
                lastClickedUrl = currentUrl;
            }

            button.click();
            console.log(`Clicked button with text: "${buttonText}"`);
            return true;
        }
    } catch (error) {
        console.error(`Error clicking button "${buttonText}":`, error);
        return false;
    }
}


async function clickButtonByText1(buttonText) {
    const xpath = `//button[.//text()[contains(., '${buttonText}')]]`;
    const button = await waitForElement1(xpath);
    if (button) {
        button.click();
        console.log(`Clicked button with text: "${buttonText}"`);
    }else{
        newJobApply()
    }
}

// Enhanced helper function for filling input or textarea fields by label
async function fillInputByLabel(labelText, inputData, elementType = 'input') {
    // Determine the target element type ('input' is default; specify 'textarea' if needed)
    const targetElement = elementType === 'textarea' ? 'textarea' : 'input';

    // Construct an XPath to find a parent div with a label containing the specified text, then look for the target element type
    const xpath = `//div[label//*[contains(text(), '${labelText}')]]//${targetElement}`;

    try {
        const field = await waitForElement(xpath);
        if (field) {
            field.value = inputData;
            field.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
            console.log(`Filled ${targetElement} field with label "${labelText}" with data: "${inputData}"`);
        } else {
            console.error(`No ${targetElement} field found for label "${labelText}"`);
        }
    } catch (error) {
        console.error(`Error locating ${targetElement} field for label "${labelText}":`, error);
    }
}

// Helper function to wait for an element to appear on the page
function waitForElement(xpath, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                clearInterval(interval);
                resolve(element);
            } else if (Date.now() - start >= timeout) {
                clearInterval(interval);
                reject(`Element with XPath "${xpath}" not found within ${timeout}ms`);
            }
        }, 100);
    });
}

function waitForElement1(xpath, timeout = 5000) {
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


// Function to handle the apply page
async function startApplication() {
    await clickButtonByText1("Apply now");
}

// Function to handle the personal details page
async function fillContactInformationPage() {
    await fillInputByLabel("First name", "John");
    await fillInputByLabel("Last name", "Doe");
    await fillInputByLabel("City, State", "Lahore, Pakistan");
    await clickButtonByText("Continue");
}

// Function to handle the resume page
async function attachResume() {
    // chrome.storage.local.get(['jobLinks'], function(result) {
    //     const jobLinks = result.jobLinks;
    //     // Use jobLinks as needed
    //     console.log('Stored job resume:', jobLinks);
        
    //     // Optional: Replace URL with next job link
    //     if (jobLinks && jobLinks.length > 0) {
    //         window.location.replace(jobLinks[0]); // Or next index
    //     }
    // });
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
    await fillInputByLabel("Company Name", "OpenAI");
    await fillInputByLabel("Location", "San Francisco");
    await clickButtonByText("Continue");
}

// Function to detect the current page based on URL or DOM
function getCurrentPage() {
    console.log("currentPage: ",window.location.href)
    if (window.location.href.includes('/viewjob')) {
        return 'apply';
    } else if (window.location.href.includes('/contact-info')) {
        return 'contact-info';
    } else if (window.location.href.includes('/resume')) {
        return 'resume';
    } else if (window.location.href.includes('/relevant-experience')) {
        return 'relevant-experience';
    } else if (window.location.href.includes('/form/questions/1')) {
        return 'extra-questions';
    } else if (window.location.href.includes('/review')) {
        return 'review';
    } else if (window.location.href.includes('/work-experience')) {
        return 'work-experience';
    } else if (window.location.href.includes('/company-details')) {
        return 'company-details';
    }else if (window.location.href.includes('/post-apply')) {
        return 'post-apply';
    }

    return null; // If no page could be identified, return null
}



async function monitorURLChanges() {
    try {
        // Call the page handler for the current page
        await handlePageFlow();
       
        const paused = await isAutomationPaused();
    
        if (paused) {
            console.log('Automation is paused. No actions will be taken.');
            return;
        }
        // Start observing URL changes
        const observer = new MutationObserver(async () => {
            const currentURL = window.location.href;

            // Check if the URL has changed
            console.log(`Current URL: ${currentURL}`);
            
            // Handle page changes by re-running the page flow logic
            await handlePageFlow();
        });

        // Observe changes to the URL in the document
        observer.observe(document, { childList: true, subtree: true });
    } catch (error) {
        console.error("Error monitoring URL changes:", error);
    }
}

// async function newJobApply() {
//     console.log('postapply' )
//     window.location.replace("https://pk.indeed.com/rc/clk?jk=1a7c6ede6f10fcf9&bb=1Toyzs_aguwcC7vBs0Ol_SxZ9M9mekuCyRcCVXc5YQqpqyKQLYy6sZB5Suawqx-_xz15H19zN7iexLGuWebMCxHa-4GYN_MRNH38s3Ou-I8gSOm_WTdRSUyIULuBCqt7&xkcb=SoCJ67M35gvlQZW3Vh0KbzkdCdPP&fccid=1a2ddce942c2dca3&cmp=TeqDirect-Software&ti=Programmer&vjs=3");
// }
async function newJobApply() {
    // Retrieve jobLinks from storage
    console.log("job applying new one",lastClickedUrl,clickCountOnSameScreen)
    lastClickedUrl = null;
    clickCountOnSameScreen = 0; 
      const indexResult = await chrome.storage.local.get(['currentIndex']);
      const currentIndex = indexResult.currentIndex || 0;
      console.log("currentIndex: ",currentIndex)

    chrome.storage.local.get(['jobLinks'], async function(result) {
        const jobLinks = result.jobLinks;
        // Use jobLinks as needed
        console.log("isAutomation: ", currentIndex,jobLinks.length,jobLinks)
        if ( currentIndex === jobLinks.length) {
            pauseAutomation()
            window.location.replace("https://pk.indeed.com/"); 
        }
        // Optional: Replace URL with next job link
        if (jobLinks && jobLinks.length > 0 && currentIndex < jobLinks.length) {
            console.log("")
            window.location.replace(jobLinks[currentIndex]); 
        
        // Increment and store the new index
        await chrome.storage.local.set({ 
            currentIndex: currentIndex + 1 
        });


        }

    });
}


// Call the function once to start the process
monitorURLChanges();



// Function to determine and handle the current page
async function handlePageFlow() {
    const page = getCurrentPage();  // Determine the current page type
console.log("currentPage: ",page)
console.log("clickCountOnSameScreen: ",clickCountOnSameScreen)

    try {
        switch (page) {
            case 'apply':
                await startApplication();
                break;
            case 'contact-info':
                await fillContactInformationPage();
                break;
            case 'resume':
                await attachResume();
                break;
            case 'relevant-experience':
                await fillRelevantExperiencePage();
                break;
            case 'extra-questions':
                await fillExtraQuestionsPage();
                break;
                case 'post-apply':
            await newJobApply();
            break;
            default:
                console.error("Unknown page:", page);
                break;
        }

        // Once all necessary fields are filled, move to the next page
        await finalizeAndSubmitApplication();

    } catch (error) {
        console.error(`Error processing page ${page}:`, error);
    }
}
