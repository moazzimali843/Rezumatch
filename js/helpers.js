// Helper function for clicking a button by text
async function clickButtonByText(buttonText) {
    const xpath = `//button[.//text()[contains(., '${buttonText}')]]`;
    const button = await waitForElement(xpath);
    if (button) {
        button.click();
        console.log(`Clicked button with text: "${buttonText}"`);
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
