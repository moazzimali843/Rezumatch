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
    "https://pk.indeed.com/rc/clk?jk=9ba366e3f8bdba5b&from=hp&tk=1idg3jhlbjvmg801&bb=QO7c9fsBmMYygpA3oXQNxiUkfd0KASD6z3kRTyqHjcNae1phleks8SKQDg7Qjk9Fyh8PYLmQj9I_nO4j-CuXhJ8UBfVseiIlJR2NPKV9doHbwzA0XRVgew5jRjiAJMJiSr0eqgpx5xw%3D&xkcb=SoCz67M35wPB4HwNoh0LbzkdCdPP",
    "https://pk.indeed.com/rc/clk?jk=3fb0b52f6639fb5f&from=hp&tk=1idg3jhlbjvmg801&bb=QO7c9fsBmMYMIgB0u5LI-EKYm5RXYiP0vTX--JaUzB5D9p4H6Z2FVvxwWKs7IUAjl7Dm9F7T_ys3x96elKNhrs6aHygIXwpQ155BlYBvbS1c0K9MaKx3roSwtK2dvvqnLi4X-K5yZ5A%3D&xkcb=SoCJ67M35wPB4GQNoh0KbzkdCdPP"
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
