// ------------------------ Process multiple links at same time ------------------------
// let currentJobLinks = [];
// let currentIndex = 0;
// let isProcessing = false;

// // Function to process the next link in the queue
// async function processNextLink() {
//     console.log(`Processing link ${currentIndex + 1} of ${currentJobLinks.length}`);
    
//     if (isProcessing || currentIndex >= currentJobLinks.length) {
//         console.log('Already processing or no more links to process');
//         return;
//     }

//     isProcessing = true;
//     const currentLink = currentJobLinks[currentIndex];
//     console.log(`Starting to process link: ${currentLink}`);

//     try {
//         await openAndAutomateTab(currentLink);
//         // Don't increment currentIndex here - we'll do it when we receive the success message
//     } catch (error) {
//         console.error("Error processing link:", error);
//         isProcessing = false;
//         // Move to next link even on error
//         currentIndex++;
//         await chrome.storage.local.set({ 'currentIndex': currentIndex });
//         processNextLink();
//     }
// }

// // Function to handle success message from content.js
// function handleSuccess(sender) {
//     console.log('Received success message from content script');
    
//     // Close the tab that sent the success message
//     chrome.tabs.remove(sender.tab.id, async () => {
//         console.log('Closed successful tab');
        
//         // Increment index and save state
//         currentIndex++;
//         await chrome.storage.local.set({ 'currentIndex': currentIndex });
        
//         // Reset processing flag
//         isProcessing = false;
        
//         console.log(`Moving to next link. Current index: ${currentIndex}, Total links: ${currentJobLinks.length}`);
        
//         // If there are more links, process the next one
//         if (currentIndex < currentJobLinks.length) {
//             setTimeout(() => processNextLink(), 2000); // Add small delay before next link
//         } else {
//             console.log("All jobs processed successfully");
//             // Reset state
//             currentJobLinks = [];
//             currentIndex = 0;
//             await chrome.storage.local.clear();
//         }
//     });
// }

// // Modified message listener
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log('Received message:', request.action);
    
//     if (request.action === "open_tab") {
//         console.log('Received job links:', request.data.jobLinks);
//         // Store the job links and reset index
//         currentJobLinks = request.data.jobLinks;
//         currentIndex = 0;
//         chrome.storage.local.set({ 
//             'jobLinks': currentJobLinks,
//             'currentIndex': currentIndex 
//         }).then(() => {
//             // Start processing links
//             processNextLink();
//         });
//         return true; // Keep message channel open for async response
//     }
    
//     if (request.action === "success") {
//         console.log('Received success message');
//         handleSuccess(sender);
//         return true; // Keep message channel open for async response
//     }
// });

// // Function to open and automate tab
// async function openAndAutomateTab(jobLink) {
//     return new Promise((resolve, reject) => {
//         chrome.tabs.create({ url: jobLink }, async (tab) => {
//             if (!tab) {
//                 reject(new Error("Failed to open tab"));
//                 return;
//             }

//             const tabId = tab.id;

//             // Wait for tab to be ready
//             chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {
//                 if (updatedTabId === tabId && info.status === 'complete') {
//                     chrome.tabs.onUpdated.removeListener(listener);
                    
//                     // Inject content script
//                     chrome.scripting.executeScript({
//                         target: { tabId: tabId },
//                         files: ["content.js"]
//                     }).then(() => {
//                         console.log('Content script injected successfully');
//                         resolve();
//                     }).catch((error) => {
//                         console.error('Failed to inject content script:', error);
//                         reject(error);
//                     });
//                 }
//             });
//         });
//     });
// }

// // Recovery mechanism for extension restart
// chrome.runtime.onStartup.addListener(async () => {
//     const data = await chrome.storage.local.get(['jobLinks', 'currentIndex']);
//     if (data.jobLinks && data.currentIndex !== undefined) {
//         currentJobLinks = data.jobLinks;
//         currentIndex = data.currentIndex;
//         if (currentIndex < currentJobLinks.length) {
//             processNextLink();
//         }
//     }
// });
// ------------------------        ------------------------



// ------------------------ Process multiple links at same time ------------------------
// Same code as above but somehow better
let currentJobLinks = [];
let currentIndex = 0;
let isProcessing = false;

// Function to process the next link in the queue
async function processNextLink() {
    console.log(`Processing link ${currentIndex + 1} of ${currentJobLinks.length}`);
    
    if (isProcessing || currentIndex >= currentJobLinks.length) {
        console.log('Already processing or no more links to process');
        return;
    }

    isProcessing = true;
    const currentLink = currentJobLinks[currentIndex];
    console.log(`Starting to process link: ${currentLink}`);

    try {
        await openAndAutomateTab(currentLink);
        // Don't increment currentIndex here - we'll do it when we receive the success message
    } catch (error) {
        console.error("Error processing link:", error);
        // Important: Wait for a short delay before retrying or moving to next link
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        isProcessing = false;
        // Move to next link even on error
        currentIndex++;
        await chrome.storage.local.set({ 'currentIndex': currentIndex });
        // Only process next link if we're not already processing
        if (!isProcessing) {
            processNextLink();
        }
    }
}

// Function to handle success message from content.js
function handleSuccess(sender) {
    console.log('Received success message from content script');
    
    // Close the tab that sent the success message
    chrome.tabs.remove(sender.tab.id, async () => {
        console.log('Closed successful tab');
        
        // Increment index and save state
        currentIndex++;
        await chrome.storage.local.set({ 'currentIndex': currentIndex });
        
        // Reset processing flag
        isProcessing = false;
        
        console.log(`Moving to next link. Current index: ${currentIndex}, Total links: ${currentJobLinks.length}`);
        
        // If there are more links, process the next one
        if (currentIndex < currentJobLinks.length) {
            // Add delay before processing next link
            setTimeout(() => {
                if (!isProcessing) {
                    processNextLink();
                }
            }, 2000);
        } else {
            console.log("All jobs processed successfully");
            // Reset state
            currentJobLinks = [];
            currentIndex = 0;
            await chrome.storage.local.clear();
        }
    });
}

// Modified message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request.action);
    
    if (request.action === "open_tab") {
        console.log('Received job links:', request.data.jobLinks);
        // Only start if we're not already processing
        if (!isProcessing) {
            // Store the job links and reset index
            currentJobLinks = request.data.jobLinks;
            currentIndex = 0;
            chrome.storage.local.set({ 
                'jobLinks': currentJobLinks,
                'currentIndex': currentIndex 
            }).then(() => {
                // Start processing links
                processNextLink();
            });
        } else {
            console.log('Already processing jobs, ignoring new request');
        }
        return true;
    }
    
    if (request.action === "success") {
        console.log('Received success message');
        if (isProcessing) {
            handleSuccess(sender);
        }
        return true;
    }
});

// Function to open and automate tab
async function openAndAutomateTab(jobLink) {
    return new Promise((resolve, reject) => {
        chrome.tabs.create({ url: jobLink }, async (tab) => {
            if (!tab) {
                reject(new Error("Failed to open tab"));
                return;
            }

            const tabId = tab.id;

            // Wait for tab to be ready
            chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {
                if (updatedTabId === tabId && info.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    
                    // Inject content script
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ["content.js"]
                    }).then(() => {
                        console.log('Content script injected successfully');
                        resolve();
                    }).catch((error) => {
                        console.error('Failed to inject content script:', error);
                        reject(error);
                    });
                }
            });
        });
    });
}

// Recovery mechanism for extension restart
chrome.runtime.onStartup.addListener(async () => {
    const data = await chrome.storage.local.get(['jobLinks', 'currentIndex']);
    if (data.jobLinks && data.currentIndex !== undefined) {
        currentJobLinks = data.jobLinks;
        currentIndex = data.currentIndex;
        if (currentIndex < currentJobLinks.length && !isProcessing) {
            processNextLink();
        }
    }
});
// ------------------------        ------------------------