# README

## Overview

This website visualizes the CSV data published from the data archive Google Sheet. By updating the Google Sheet, the website will automatically reflect the changes. The Google Sheet can be accessed at: [Google Sheet Link](https://docs.google.com/spreadsheets/d/19HGHLFto5FMGMW7fh9FCj7XZkjTxnd_q-yR6wkgsQPI/edit?usp=sharing) or click the top right navigation link.

## Data Source

Our data is stored on the Albatross server. When we click the "Download" button on the website, a pop-up window will display the specific file address on the server.

## Server Operations

### Connecting to the Server

To connect to the Albatross server, we can use `SSH`. Use the following applications based on our operating system:

* macOS: `Terminal`
* Windows: `Command Prompt` or `PowerShell`

Please note that connecting to this server requires using the **UCSB campus network**. If you are not within the campus network service range, you will need to download and connect to the VPN software.

Then use the following command:

```sh
ssh grit_username@128.111.100.42
```

Then it will ask for the **password**. Enter the password to connect to the server.

### Navigating the Server

Once connected to the server, we can navigate the file system using the following commands:

- **Change Directory (`cd`):**

  ```sh
  cd /path/to/directory

  cd /home/movelab/open_data/ # Locate the open data folder
  cd /home/movelab/open_data/specific_data # Locate the specific data folder
  cd .. # Move up one directory, i.e., go back to open data folder
  ```

- **Create Directory (`mkdir`):**

  ```sh
  mkdir new_directory

  cd /home/movelab/open_data/ # Locate the open data folder 
  mkdir specific_data # Create a new data folder
  ```

- **Remove Directory (`rm -r`):**

  ```sh
  rm -r directory_name

  cd /home/movelab/open_data/ # Locate the open data folder
  rm -r specific_data # Remove the specific data folder
  ```

- **List Files (`ls`):**

  ```sh
  ls # List all files and directories in the current directory
  ls -l # List all files and directories in the current directory with details
  ls -R # List all files and directories in the current directory and subdirectories
  ```

### Downloading Files

To download files from the server, we can use `scp`. Open the Terminal application on macOS or Command Prompt/PowerShell on Windows and use the following command:

```sh
scp -r grit_username@128.111.100.42:/path/to/remote/file /path/to/local/directory

# Download the specific data folder and save it to the 'Downloads' folder
scp -r grit_username@128.111.100.42:/home/movelab/open_data/specific_data /Users/username/Downloads 
```

Once we entered the password, the download will start.

### Uploading Files

Uploading files is similar to downloading files except we need to reverse the source and destination paths. Before uploading files, make sure the **upload path exists on the server**! Use the following command:

```sh
scp -r /path/to/local/directory grit_username@128.111.100.42:/path/to/remote/file

# Upload the specific data folder to the server
scp -r /Users/username/Downloads/specific_data grit_username@128.111.100.42:/home/movelab/open_data
```