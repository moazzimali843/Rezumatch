document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-automation");
  const jobTitleInput = document.getElementById("jobTitle");
  const locationInput = document.getElementById("location");

  // Check automation status on popup open
  chrome.storage?.local.get("isAutomating", (data) => {
    if (data.isAutomating) {
      startButton.textContent = "Stop Automation";
      startButton.classList.add("stopping");
      jobTitleInput.disabled = true;
      locationInput.disabled = true;
      chrome.storage.local.set({ isAutomationPaused: false });
    }
  });

  startButton.addEventListener("click", async () => {
    const jobTitle = jobTitleInput.value.trim();
    const location = locationInput.value.trim();

    if (startButton.classList.contains("stopping")) {
      // Stop automation
      chrome.storage.local.set({ isAutomating: false });
      chrome.runtime.sendMessage({ action: "stop_automation" });
      startButton.textContent = "Start Automation";
      startButton.classList.remove("stopping");
      jobTitleInput.disabled = false;
      locationInput.disabled = false;
      return;
    }

    alert(`Job title is: ${jobTitle} and location is: ${location}`);

    if (!jobTitle || !location) {
      alert("Please fill in both job title and location");
      return;
    }

    // Start automation
    chrome.storage.local.set({ isAutomating: true });
    startButton.textContent = "Stop Automation";
    startButton.classList.add("stopping");
    jobTitleInput.disabled = true;
    locationInput.disabled = true;

    const indeedURL = `https://www.indeed.com/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`;

    // Send job title and location to the backend
    const jobLinks = [
      "https://pk.indeed.com/rc/clk?jk=7561f660c2c09bcb&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtLJ9N4TWGRc4O0_b2TL94U0LnaF6ma0SOFll_E0Wfe46BnEgeWl-UZwlh3JHUiUAEkd6XCi4DAQWgulqcxqNvHR9ZMXrUYrpVOJN4JI_c43ce2qFq-KrYwEUXCaeR5eKxg%3D&xkcb=SoCt67M358pdamy2k50KbzkdCdPP",
      "https://pk.indeed.com/rc/clk?jk=7bd85943fb98ce0e&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtIAJq0akCH0Os_dwfZJ9CK9KYA3KGnOoevf1eQ-C54aIC4ie1Aw2h8g1DXCJvsrTRLASgqDiEJjJr9Ir1Yzl_uS0d5z2b12dLNlKArQuukj3iEI52856-eb769TB5bvKs0%3D&xkcb=SoAK67M358pdamy2k50PbzkdCdPP",
      "https://pk.indeed.com/rc/clk?jk=d67213d76194f769&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtKH658C3Dpr9sp5OFR5sWB0nCr8fU6t7F7dkwxspp-VN92V4BK6yLJc5TTXfuoaKkbyHCHgwCD7P22j6sklg4xq1IZqDPPFCS_uocY7V_sQu7-yXIrybCqjguY5aU-g1fc%3D&xkcb=SoC-67M358pdamy2k50ObzkdCdPP",
      "https://pk.indeed.com/rc/clk?jk=a4a7a0e8445bfa19&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtI7WsozvAilTOO0vBZQULFcHNHvCxppIDA4N23GQExr9qN14A49VxfDg_Ctt7RaI9u5hkBKMeA_-eu9-zacC5Bj72jZqQCUh8E-xCYMYBgOUKf8Ix11TNlLEDIArKrfcqk%3D&xkcb=SoCv67M358pdahS2k50LbzkdCdPP",
      "https://pk.indeed.com/rc/clk?jk=f696793bba510ceb&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtIX-QUvQXX08Mzq7Hvw49fmYERrv14Fc4pt0JoBHkOIeAj50_YLFNEE1IEyCSRpRCI-q1w3oF3Tl86wmMBaH8SeGq9mVWrHNm435WhGJbtsjpunzUQQRcC8tb8Cqm2sg2w%3D&xkcb=SoCG67M358pdahS2k50JbzkdCdPP"
       ];
    chrome.runtime.sendMessage({
      action: "open_tab",
      data: { jobLinks },
    });

    //   fetch('https://d467-103-115-198-72.ngrok-free.app/application_process', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ jobTitle, location })
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log("data: ", data)
    //     const jobLinks = data.jobLinks;
    //     alert(`jobLink ${jobLinks}`);
    //     console.log("jobLink: ", jobLinks)
    //     // Send the job link to the background script
    //     chrome.runtime.sendMessage({
    //       action: 'open_tab',
    //       data: { jobLinks }
    //     });
      })
      .catch(error => {
        console.error('Error fetching job link:', error);
      });
  });
// });
