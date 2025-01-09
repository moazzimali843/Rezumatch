document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-automation");
  const jobTitleInput = document.getElementById("jobTitle");
  const locationInput = document.getElementById("location");
  const countryInput = document.getElementById("country");

  // Switch to toggle hardcoded links for testing
  const useHardcodedLinks = true; // Set this to `true` for testing with hardcoded links.

  const hardcodedJobLinks = [
    "https://pk.indeed.com/viewjob?jk=e460034524d2a712&tk=1ih5vh6tmic36803&from=hp&advn=5897884788172860&adid=434546299&ad=-6NYlbfkN0A7S7BGxvdrcAplQCZbT4k2CFCA-ulLlibz3wPEtEl39REKaHHtN2bc-pnrchS6C1Si2HECsWYuy75Sv2HWBdszmWggCV74wklIM5JVuSUPfHY3CBWa0fzh4pzJsyATSDt5ZZQ_emLfre9f3C3dLjtgIIGF33U_BDW-y4czlfo275iUuSbcpsBqv-Cmm5IAM6cIMAJ0jstiqyP6UhjuzHyFDURqiBTawIKTAy19lKmlDw0sCEWRqiNFfZ4Q25owXZeGc2ZvLHuxzYJo8mS3tfpFo-uDVkfP8R82ew6R-Z2_0tDWE1-9eDo3W81XFP7UkohohJp9NJYwYM66Id-bBaX6IiOmqj-yvEgChGKABP0gqc2-sXctPE1d8KoMmVQZ4D2pxiJVD7URlMR9tf6Jv6rK8i0o2yq3Xpn6XrM20IMU7RReWFpAuVXiNSL6HasWucdX3D8h-_bqWXLzyppi5xk2Fc9AWqgz3EnNMPIy2lWyonHDd_ozdLDCNvcA3frln7LbDpyA6nUdnK4Gl7BfiquwPTVxOwovwR9KE1UXG0wiKBrNkpqIB7RYgqCcEUgmXSua5h86p1q1Qg%3D%3D&pub=4a1b367933fd867b19b072952f68dceb&camk=nUmJqO2E8rhMbw6CfhcznQ%3D%3D&xkcb=SoB36_M33l3LPdSKZB0LbzkdCdPP&xpse=SoBw6_I33mOnDlAyqr0ObzkdCdPP&xfps=b10b5f33-1744-4125-a97c-90486f1e2568&vjs=3",
    "https://pk.indeed.com/rc/clk?jk=45d83eca39ed440b&bb=yF2KGhWFlyljyFG-dE-CYyl1w58OZzrl4TC6JIsCo8Gh9tyPmbt03ZelAOIndYzyZSa7NbeoMf0YCF7nRJhmP09w3dMgm8vE2AwNfYpat_XJ9sjbtX3b6cx8hE0Thrab&xkcb=SoCD67M33j0TaIzToZ0LbzkdCdPP&fccid=9b1b3ed93edda4b7&cmp=Code-Graphers&ti=Python+Developer&vjs=3",
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
