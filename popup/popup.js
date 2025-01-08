document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-automation");
  const jobTitleInput = document.getElementById("jobTitle");
  const locationInput = document.getElementById("location");
  const countryInput = document.getElementById("country");

  // Switch to toggle hardcoded links for testing
  const useHardcodedLinks = true; // Set this to `true` for testing with hardcoded links.

  const hardcodedJobLinks = [
    "https://pk.indeed.com/viewjob?cmp=Maeme%2527s-Limited&t=Python%20Developer&jk=b4560bdb5df2d25e&xpse=SoCR67I33jKEOYQkjJ0LbzkdCdPP&xfps=2ff04349-fcaa-47fa-b5ea-54c5f90906e5&xkcb=SoBb67M33ig3yPRq5p0JbzkdCdPP&vjs=3&from=iaBackPress",
    "https://pk.indeed.com/viewjob?cmp=99-Technologies&t=Python%20Developer&jk=c7bc608e15938c1c&q=indeedapply%3A1%20python%20developer&xpse=SoCc67I33jKDGWRCI50LbzkdCdPP&xfps=5c8f3579-238d-484f-8117-8c136b34443e&xkcb=SoBh67M33ig3yPRq5p0PbzkdCdPP&vjs=3&from=iaBackPress",
    "https://pk.indeed.com/viewjob?cmp=ArkPlus-Private-Limited&t=Junior%20Python%20Developer&jk=a97257e3a17dc5ce&q=indeedapply%3A1%20python%20developer&xpse=SoBn67I33jKCxcwkgJ0LbzkdCdPP&xfps=365c1349-439a-4eed-a5fa-60ce0ee45720&xkcb=SoDV67M33ig3yPRq5p0ObzkdCdPP&vjs=3&from=iaBackPress"
     ];

  // Check automation status on popup open
  chrome.storage.local.get("isAutomating", (data) => {
      if (data.isAutomating) {
          startButton.textContent = "Stop Automation";
          startButton.classList.add("stopping");
          jobTitleInput.disabled = true;
          locationInput.disabled = true;
          countryInput.disabled = true;
          chrome.storage.local.set({ isAutomationPaused: false });
      }
  });

  startButton.addEventListener("click", async () => {
      const jobTitle = jobTitleInput.value.trim();
      const location = locationInput.value.trim();
      const country = countryInput.value.trim();

      if (startButton.classList.contains("stopping")) {
          // Stop automation
          chrome.storage.local.set({ isAutomating: false });
          chrome.runtime.sendMessage({ action: "stop_automation" });
          startButton.textContent = "Start Automation";
          startButton.classList.remove("stopping");
          jobTitleInput.disabled = false;
          locationInput.disabled = false;
          countryInput.disabled = false;
          return;
      }

      if (!jobTitle || !location || !country) {
          alert("Please fill all");
          return;
      }

      // Start automation
      chrome.storage.local.set({ isAutomating: true });
      startButton.textContent = "Stop Automation";
      startButton.classList.add("stopping");
      jobTitleInput.disabled = true;
      locationInput.disabled = true;
      countryInput.disabled = true;

      if (useHardcodedLinks) {
          // Use hardcoded links for testing
          console.log("Using hardcoded job links:", hardcodedJobLinks);
          alert(`Using hardcoded job links: ${hardcodedJobLinks}`);
          chrome.runtime.sendMessage({
              action: 'open_tab',
              data: { jobLinks: hardcodedJobLinks },
          });
      } else {
          // Fetch job links from the backend
          fetch('http://127.0.0.1:5000/scrape-jobs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ jobTitle, location, country }),
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
            console.log("Response data:", data);
              const jobLinks = data.jobLinks || [];
              console.log("jobLinks:", jobLinks);
              if (jobLinks.length === 0) {
                  alert("No job links found!");
                  return;
              }
              chrome.runtime.sendMessage({
                  action: 'open_tab',
                  data: { jobLinks },
              });
          })
          .catch(error => {
              console.error('Error fetching job links:', error);
              alert('Failed to fetch job links. Please try again later.');
          });
      }
  });
});
