// document.addEventListener("DOMContentLoaded", () => {
//   const startButton = document.getElementById("start-automation");
//   const jobTitleInput = document.getElementById("jobTitle");
//   const locationInput = document.getElementById("location");

//   // Check automation status on popup open
//   chrome.storage?.local.get("isAutomating", (data) => {
//     if (data.isAutomating) {
//       startButton.textContent = "Stop Automation";
//       startButton.classList.add("stopping");
//       jobTitleInput.disabled = true;
//       locationInput.disabled = true;
//       chrome.storage.local.set({ isAutomationPaused: false });
//     }
//   });

//   startButton.addEventListener("click", async () => {
//     const jobTitle = jobTitleInput.value.trim();
//     const location = locationInput.value.trim();

//     if (startButton.classList.contains("stopping")) {
//       // Stop automation
//       chrome.storage.local.set({ isAutomating: false });
//       chrome.runtime.sendMessage({ action: "stop_automation" });
//       startButton.textContent = "Start Automation";
//       startButton.classList.remove("stopping");
//       jobTitleInput.disabled = false;
//       locationInput.disabled = false;
//       return;
//     }

//     alert(`Job title is: ${jobTitle} and location is: ${location}`);

//     if (!jobTitle || !location) {
//       alert("Please fill in both job title and location");
//       return;
//     }

//     // Start automation
//     chrome.storage.local.set({ isAutomating: true });
//     startButton.textContent = "Stop Automation";
//     startButton.classList.add("stopping");
//     jobTitleInput.disabled = true;
//     locationInput.disabled = true;

//     const indeedURL = `https://www.indeed.com/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`;

//     // Send job title and location to the backend
// //     const jobLinks = [ "https://pk.indeed.com/rc/clk?jk=3fb0b045840dd388&bb=K2qoxIfpmeHvvJsaH2BV3_litDMhqBUEPi30MnlzTmwZZCgqS4wd8byfwYlHxYfLmY0xLmPnvOjR9WNzurrpAjui13UWVMs2ZIr06cP_xOuuvyqVcimWb5_sMotFnPNS&xkcb=SoD667M35lOusSzmx50ObzkdCdPP&fccid=39b6e51eea365e6e&cmp=TechBucks&ti=Junior+Developer&vjs=3",
// //       "https://pk.indeed.com/pagead/clk?mo=r&ad=-6NYlbfkN0CMyji5D2Sy-_-WZPdQOG5WWHnYj32kDoWiOdrBpEynC54kuVavwUHRpX_FN6E6mH2bCYGM4zdPlvEDzs-Z8rYwibOk_CmJ6ufNQpmvRXyWpzybF4Ftx5e59yjTl7cGu-t4gKO9VXePLfyoDU6YupJzgOqA_dJJ3IKaxNH9DURc1z09p8CqqmREipTT_EDSjH0aYQ1-yksyxSKP5jQ85ajjcVp1hGcRbOSMv8RdZCqX7yJNQ9kEcIBnCNtQnQpkJYHhY8NXk_84pO7PTIK5s6fnQOnhjOHsHQEncwoRhkqaNFBBv80KyjgFhtNeb7bJl0BmxqWK9Jx0diDtckfIH2QHYTZAQZnCf4wfqZx_D2QGCyjz69QVO5qbUrvERpJOSyMK6vqKVlnnN_IoJR9iQ5YjEJPKR1avYZmLntcHJR9WilRSKEaFM6gury5d2etO0D7v_uOAdzqpkGqx8q6wEQsHurCvm9axeEDlMfTvo5HzsHOd7_SRBRT5SmA8h9VD69QcJoyy0x56IEjJpd6qDuGMNeNwEn-nUqDzPlYRi-fiiP0BgaUOU8f7LriJzfYgLGVaG_4ssvvW6mT-cLYzsI4A779ztD7LZm6GbCNR-eBzdwiFl-ao7ze-n_Ef4OTAK_WLIWOsYbUuIZHSqySxDTBIFiKl7LTxMi0%3D&xkcb=SoBl6_M35tHz-PRYQx0LbzkdCdPP&camk=H-lBaXMUocKAEqDONW902g%3D%3D&from=hp&tk=1idd7v0ubj6ut800&jsa=6539&vjs=3",
// // "https://pk.indeed.com/rc/clk?jk=bd50fbc4f98496ae&bb=K2qoxIfpmeHvvJsaH2BV35q-UHIp1B5Y3xc3yZXP6y0YVW3cnt2uFovwzW39kZOq2sNZ_2eYKZCBK9_bLfiELVeJT2iHRaDDtNKBUs_IJDq2y2KpGi4mdtbR5l8L2It9&xkcb=SoA667M35lOusSzmx50DbzkdCdPP&fccid=4b291d20a7ed1770&cmp=Sky-IT-Services&ti=Front+End+Developer&vjs=3"
// //  ];
//     chrome.runtime.sendMessage({
//       action: "open_tab",
//       data: { jobLinks },
//     });

//       fetch('https://ad3a-223-123-11-188.ngrok-free.app/application_process', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ jobTitle, location })
//     })
//       .then(response => response.json())
//       .then(data => {
//         console.log("data: ", data)
//         const jobLinks = data.jobLinks;
//         alert(`jobLink ${jobLinks}`);
//         console.log("jobLink: ", jobLinks)
//         // Send the job link to the background script
//         chrome.runtime.sendMessage({
//           action: 'open_tab',
//           data: { jobLinks }
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching job link:', error);
//       });
//   });
// });








document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-automation");
  const jobTitleInput = document.getElementById("jobTitle");
  const locationInput = document.getElementById("location");

  // Switch to toggle hardcoded links for testing
  const useHardcodedLinks = true; // Set this to `true` for testing with hardcoded links.

  const hardcodedJobLinks = [
    "https://pk.indeed.com/rc/clk?jk=7561f660c2c09bcb&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtLJ9N4TWGRc4O0_b2TL94U0LnaF6ma0SOFll_E0Wfe46BnEgeWl-UZwlh3JHUiUAEkd6XCi4DAQWgulqcxqNvHR9ZMXrUYrpVOJN4JI_c43ce2qFq-KrYwEUXCaeR5eKxg%3D&xkcb=SoCt67M358pdamy2k50KbzkdCdPP",
    "https://pk.indeed.com/rc/clk?jk=7bd85943fb98ce0e&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtIAJq0akCH0Os_dwfZJ9CK9KYA3KGnOoevf1eQ-C54aIC4ie1Aw2h8g1DXCJvsrTRLASgqDiEJjJr9Ir1Yzl_uS0d5z2b12dLNlKArQuukj3iEI52856-eb769TB5bvKs0%3D&xkcb=SoAK67M358pdamy2k50PbzkdCdPP",
    "https://pk.indeed.com/rc/clk?jk=d67213d76194f769&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtKH658C3Dpr9sp5OFR5sWB0nCr8fU6t7F7dkwxspp-VN92V4BK6yLJc5TTXfuoaKkbyHCHgwCD7P22j6sklg4xq1IZqDPPFCS_uocY7V_sQu7-yXIrybCqjguY5aU-g1fc%3D&xkcb=SoC-67M358pdamy2k50ObzkdCdPP",
    "https://pk.indeed.com/rc/clk?jk=a4a7a0e8445bfa19&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtI7WsozvAilTOO0vBZQULFcHNHvCxppIDA4N23GQExr9qN14A49VxfDg_Ctt7RaI9u5hkBKMeA_-eu9-zacC5Bj72jZqQCUh8E-xCYMYBgOUKf8Ix11TNlLEDIArKrfcqk%3D&xkcb=SoCv67M358pdahS2k50LbzkdCdPP",
    "https://pk.indeed.com/rc/clk?jk=f696793bba510ceb&from=hp&tk=1idsgklccj6ut800&bb=LV1bXcg8XtIX-QUvQXX08Mzq7Hvw49fmYERrv14Fc4pt0JoBHkOIeAj50_YLFNEE1IEyCSRpRCI-q1w3oF3Tl86wmMBaH8SeGq9mVWrHNm435WhGJbtsjpunzUQQRcC8tb8Cqm2sg2w%3D&xkcb=SoCG67M358pdahS2k50JbzkdCdPP"
     ];

  // Check automation status on popup open
  chrome.storage.local.get("isAutomating", (data) => {
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
          fetch('https://ad3a-223-123-11-188.ngrok-free.app/application_process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ jobTitle, location }),
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
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
