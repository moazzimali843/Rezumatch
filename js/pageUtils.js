// Function to detect the current page based on URL or DOM
function getCurrentPage() {
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
    }

    return null; // If no page could be identified, return null
}
