document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-automation");
  const jobTitleInput = document.getElementById("jobTitle");
  const locationInput = document.getElementById("location");
  const countryInput = document.getElementById("country");

  // Switch to toggle hardcoded links for testing
  const useHardcodedLinks = true; // Set this to `true` for testing with hardcoded links.

  const hardcodedJobLinks = [
    "https://pk.indeed.com/rc/clk?jk=3914e41cd606e225&bb=FqwQDatvp3tMGdyG8_rXwpmJ485eOhqJxcmTUCJ3oSjX-adbiupniEB0zLkLlqO2jjdcsCGBjn1Bglb4fBKxhwiFXyW4-1B2A8qwBoDCzhqrNaaSZRgZv_6i5_KJjLEl&xkcb=SoCa67M33j0_bZRYZx0DbzkdCdPP&fccid=3f64c98d78db4da2&cmp=Cortech-sols-pvt-ltd&ti=Ai%2Fml+Engineer&vjs=3",
    "https://pk.indeed.com/rc/clk?jk=45d83eca39ed440b&bb=yF2KGhWFlyljyFG-dE-CYyl1w58OZzrl4TC6JIsCo8Gh9tyPmbt03ZelAOIndYzyZSa7NbeoMf0YCF7nRJhmP09w3dMgm8vE2AwNfYpat_XJ9sjbtX3b6cx8hE0Thrab&xkcb=SoCD67M33j0TaIzToZ0LbzkdCdPP&fccid=9b1b3ed93edda4b7&cmp=Code-Graphers&ti=Python+Developer&vjs=3",
    "https://pk.indeed.com/rc/clk?jk=28bfb18954506565&bb=yF2KGhWFlyljyFG-dE-CY0hSUWZRw9PoMvAXAa6B2Onx4vvbYRJGHXtNb8xIMS0BbomWvqgzuzbyIGF6PWoBQa42mRgXZQ2CaoB13sSx7Cfhdw2yQte01ppf7pBDQOR6&xkcb=SoA367M33j0TaIzToZ0KbzkdCdPP&fccid=854d5560752c1e18&cmp=Tecjaunt&ti=Back+End+Developer&vjs=3",
    "https://pk.indeed.com/rc/clk?jk=9a59aa3caea2630d&bb=FqwQDatvp3tMGdyG8_rXwqVKsONEkeZEdb2eQkF81kx8zQnHlIBS9q7d-0_3BsDFKruolvoKRG-hAr_3UjWCv2GwhcYGqqXRQ3DfJXtELrjc_nYoiA38axcD7mBdi5oQ&xkcb=SoBa67M33j0_bZRYZx0ObzkdCdPP&fccid=8d2c4609b71b6afd&cmp=Smart-Placement&ti=Machine+Learning+Engineer&vjs=3"
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
