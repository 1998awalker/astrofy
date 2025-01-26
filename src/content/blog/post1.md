---
title: "HYPERVSCRIPTS"
description: "
This tool allows you to configure and set up virtual location area networks (VLANs) using Hyper-V to create virtual machines.
"
pubDate: "FEB 2025"
# heroImage: "/post_img.webp"
tags: ["NETWORKING"]
---

This tool allows you to configure and set up virtual location area networks (VLANs) using Hyper-V to create virtual machines.

After entering the machine name and customizing the network settings - such as VLAN names, adapter names, and IP addresses - the tool will generate a PowerShell script for you. This script will automatically create the necessary virtual switches and network adapters and rename/re-IP them

This tool simplifies the process of setting up complex network configurations for machines, highlighting the ability to script these workflows

#### Hyper-V Installation

**Install Hyper-V**
1. Open **Windows Features**:
    - Press `Win + S`, type **Windows Features**, and select **Turn Windows features on or off**.
2. Enable **Hyper-V**:
    - Check:
      - **Hyper-V Management Tools → Hyper-V Module for Windows PowerShell**
      - **Hyper-V Platform → Hyper-V Hypervisor**
3. Click **OK** and restart if prompted.

#### Hyper-V Config Table  

<div style="margin-top: 20px; margin-bottom: 10px; text-align: center;">
<table id="machineNameTable">
  <thead>
    <tr>
      <th>NAME OF MACHINE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td contenteditable="true" id="machineNameCell">Enter Machine Name</td>
    </tr>
  </tbody>
</table>

<table id="networkConfigTable">
  <thead>
    <tr>
      <th>USER VLAN Name</th>
      <th>Disguise Hardware Configuration</th>
      <th>Adapter Name</th>
      <th>VLAN</th>
      <th>IP Address</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <!-- Rows will be dynamically populated -->
  </tbody>
</table>

<!-- Editable Number of Machines Field
<div style="margin-top: 20px; margin-bottom: 10px; text-align: center;">
<table id="machineNameTable">
  <thead>
    <tr>
      <th>Number of Servers</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td contenteditable="true" id="NumberofServer">Number of Servers</td>
    </tr>
  </tbody>
</table> -->
    
</div>
<p>Enter the machine name below. Edit the configuration table to configure your network settings. Click "Export PowerShell Script" to save the configuration to a PowerShell script file.</p>

<button class="btn" onclick="addRow()">Add Row</button>
<button class="btn" onclick="exportPowerShell()">Export PowerShell Script</button>
<button class="add-row-btn" onclick="exportRemoveVMSwitch()">Remove VMSwitch</button>
<!-- Footer Section -->

<style>
  /* Style fix for dropdown and table */
  input[list] {
    width: 100%;
    box-sizing: border-box;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #FFFFFF
  }

  td select, td input {
    width: 100%;
  }
</style>

<script>
  // Initial Network Configuration for first 4 rows (Make sure VLAN values are numbers, not strings)
const networkConfig = [
    { VLANName: "d3Net", DisguiseConfig: "A - 10Gbit", AdapterName: "Intel(R) I210 Gigabit Network Connection", VLAN: 10, IP: "" },
    { VLANName: "ARTNET", DisguiseConfig: "B - 10Gbit", AdapterName: "Intel(R) I210 Gigabit Network Connection", VLAN: 20, IP: "" },
    { VLANName: "Media Net", DisguiseConfig: "C - 100Gbit", AdapterName: "Intel(R) I210 Gigabit Network Connection", VLAN: 30, IP: "" },
    { VLANName: "MGMT", DisguiseConfig: "D - 100Gbit", AdapterName: "Intel(R) I210 Gigabit Network Connection", VLAN: 40, IP: "" }
];

// Adapter options for dropdown (alphabetized)
const adapterOptions = [

    "Intel(R) Ethernet Controller X710 for 10GBASE-T",
    "Intel(R) Ethernet Controller X710 for 10GBASE-T #2",
    "Intel(R) Ethernet Controller X722 for 10GBASE-T #1",
    "Intel(R) Ethernet Controller X722 for 10GBASE-T #2",
    "Intel(R) Ethernet Converged Network Adapter X550-T2",
    "Intel(R) Ethernet Converged Network Adapter X550-T2 #2",
    "Intel(R) I210 Gigabit Network Connection",
    "Intel(R) I210 Gigabit Network Connection #2",
    "Intel(R) I210 Gigabit Network Connection #3",
    "Intel(R) I210 Gigabit Network Connection #4",
    "Mellanox ConnectX-6 Dx Adapter",
    "Mellanox ConnectX-6 Dx Adapter #2",
    "Mellanox ConnectX-5 Dx Adapter",
  "Mellanox ConnectX-5 Dx Adapter #2",
].sort();

// Disguise hardware configurations (alphabetized)
const disguiseOptions = [
    "10Gbit - 1",
    "10Gbit - 2",
    "1Gbit - 3",
    "1Gbit - 4",
    "A - 10Gbit",
    "A - 10Gbit",
    "A - d3Net 1Gbit",
    "B - 10Gbit",
    "B - Media 10Gbit",
    "B - ArtNet 1Gbit",
    "C - 100Gbit",
    "C - Media 10Gbit",
    "D - 100Gbit",
    "D - 25Gbit",
    "E - 100Gbit",
    "E - 25Gbit",
    "F - 100Gbit",
    "B - ArtNet 1Gbit",
].sort();

// Popular VLAN names
const vlanNameOptions = [
    "d3Net",
    "KVM",
    "Media Net",
    "PSN",
    "NDI",
    "Internet",
    "sACN/Artnet",
    "OSC/Control",
    "Omnical",
    "PTZ Camera Control",
    "MGMT"
].sort();

// Populate the configuration table with initial data
function populateTable() {
    const tableBody = document.getElementById('networkConfigTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    networkConfig.forEach((config, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input list="vlanNames" value="${config.VLANName}" oninput="updateConfig(${index}, 'VLANName', this.value)" />
                <datalist id="vlanNames">
                    ${vlanNameOptions.map(option => `<option value="${option}"></option>`).join('')}
                </datalist>
            </td>
            <td>
                <select onchange="updateConfig(${index}, 'DisguiseConfig', this.value)">
                    ${disguiseOptions.map(option => 
                        `<option value="${option}" ${option === config.DisguiseConfig ? 'selected' : ''}>${option}</option>`
                    ).join('')}
                </select>
            </td>
            <td>
                <select onchange="updateConfig(${index}, 'AdapterName', this.value)">
                    ${adapterOptions.map(adapter => 
                        `<option value="${adapter}" ${adapter === config.AdapterName ? 'selected' : ''}>${adapter}</option>`
                    ).join('')}
                </select>
            </td>
            <td contenteditable="true" oninput="updateConfig(${index}, 'VLAN', parseInt(this.textContent.trim()) || '')">${config.VLAN}</td>
            <td contenteditable="true" oninput="updateConfig(${index}, 'IP', this.textContent.trim())">${config.IP}</td>
            <td><button class="btn" onclick="deleteRow(${index})">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Update configuration array when a change is made in the table
function updateConfig(index, key, value) {
    networkConfig[index][key] = value;
}

// Add a new row with default configuration
function addRow() {
    const lastRow = networkConfig[networkConfig.length - 1] || {};
    const lastVLAN = lastRow.VLAN || 0;

    // Increment VLAN by 10
    const newVLAN = lastVLAN + 10;

    networkConfig.push({ 
        VLANName: "", 
        DisguiseConfig: lastRow.DisguiseConfig || disguiseOptions[0], 
        AdapterName: lastRow.AdapterName || adapterOptions[0], 
        VLAN: newVLAN, 
        IP: "" 
    });
    populateTable();
}


// Delete a row from the table
function deleteRow(index) {
    if (confirm("Are you sure you want to delete this row?")) {
        networkConfig.splice(index, 1);
        populateTable();
    }
}


function exportRemoveVMSwitch() {
    const uniqueAdapters = [...new Set(networkConfig.map(config => config.AdapterName))];
    console.log('Unique Adapters:', uniqueAdapters);  // Check if this outputs the correct adapter names

    let psScript = '# PowerShell script to remove VMSwitch for each NIC\n\n';
    
    uniqueAdapters.forEach(adapter => {
        psScript += `Remove-VMSwitch -Name "${adapter}" -Force\n`;
    });

    const blob = new Blob([psScript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "REMOVE-VMSWITCH.ps1";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportPowerShell() {
    const machineName = document.getElementById('machineNameCell').textContent.trim();
    const numberOfServers = 1

    if (!machineName || machineName === "Enter Machine Name") {
        alert("Please enter a valid machine name!");
        return;
    }

    // Loop over the number of servers
    for (let serverIndex = 1; serverIndex <= numberOfServers; serverIndex++) {
        let psScript = `# ${machineName} - Disguise HYPERV Config - Server ${serverIndex}\n\n`;

        // Set to track the switches already added
        const switchesAdded = new Set();

        networkConfig.forEach(config => {
            if (config.AdapterName && config.DisguiseConfig && config.VLANName) {
                // The Switch Name is based on the Adapter Name
                const switchName = config.AdapterName;
                // The Net Adapter Name is based on the Disguise Hardware Configuration
                const netAdapterName = config.DisguiseConfig;

                // Add the New-VMSwitch command only if the switch hasn't been added yet
                if (!switchesAdded.has(switchName)) {
                    psScript += `New-VMSwitch -Name "${switchName}" -AllowManagementOS $true -NetAdapterName "${netAdapterName}"\n`;
                    switchesAdded.add(switchName); // Mark this switch as added
                }

                // Create VM Network Adapter using the VLAN Name
                psScript += `Add-VMNetworkAdapter -ManagementOS -Name "${config.VLANName}" -SwitchName "${switchName}"\n`;

                // Set VLAN ID using the VLAN Name
                psScript += `Set-VMNetworkAdaptserVlan -VMNetworkAdapterName "${config.VLANName}" -VlanId ${config.VLAN || 0} -Access -ManagementOS\n`;

                // Check if the IP is provided for this adapter (VLAN Name)
                if (config.IP) {
                    const ipAddress = config.IP;
                    const gateway = `${ipAddress.split('.').slice(0, 3).join('.')}.1`;  // Build the gateway as xxx.xxx.xx.1

                    // Configuring IP address and Gateway for VLAN - the bottom area is hardcoded to for the HYPER-Vexport its formatting then aligns left in text editor
                    psScript += `
# Configuring IP address and Gateway for VLAN ${config.VLANName}
Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\services\\Tcpip\\Parameters\\Interfaces\\$((Get-NetAdapter -InterfaceAlias 'vEthernet (${config.VLANName})').InterfaceGuid)" -Name EnableDHCP -Value 0
Remove-NetIpAddress -InterfaceAlias 'vEthernet (${config.VLANName})' -Confirm:\$false
Remove-NetRoute -InterfaceAlias 'vEthernet (${config.VLANName})' -AddressFamily IPv4 -Confirm:\$false
New-NetIpAddress -InterfaceAlias 'vEthernet (${config.VLANName})' -IpAddress ${ipAddress} -PrefixLength 24 -DefaultGateway ${gateway} -AddressFamily IPv4
`;
                }
                // If IP is missing, DHCP will remain active (no IP configuration is done)
            }
        });

        // Create and download the PowerShell script with dynamic file name
        const blob = new Blob([psScript], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${machineName}-NETWORK-CONFIG-HYPERV.ps1`;  // Unique file for each server
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


window.onload = function() {
    populateTable();  // This will populate the table when the page is loaded or refreshed
};
