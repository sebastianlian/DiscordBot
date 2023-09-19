# DiscordBot

## Description
- The plan is to automate the cleaning of a Discord server by creating a dedicated Discord bot. The bot will respond to a command and work on a set schedule. It will have configurable options, a customizable blacklist, and a preview feature to show which inactive members are going to be removed.

## Technologies Used
- JavaScript
- [Figma]()

## Bit Bot Boot Team Roles
**Gabriel Kerven**
https://github.com/GGC-SD/DiscordBot.git
1. Lead Programmer
2. Client liasion
:boom:

***Alexis Pardo***
1. UI/UX Design :pencil2:
2. Testing lead :computer:

***Ravjot Singh***
https://github.com/GGC-SD/DiscordBot.git
1. Data Modeler
2. Team Manager :raising_hand_man:

***Chidiebube Okebalama***
https://github.com/GGC-SD/DiscordBot.git
1. Lead Programmer :floppy_disk:
2. Documentation Lead :bookmark_tabs:

## Communication Tools
- Discord

## Repo Location
- [Repo Link](https://github.com/GGC-SD/DiscordBot.git)

## Progress Tracking Tool
- Jira
- [Progress tool Link](https://jira.ggc.edu/secure/RapidBoard.jspa?rapidView=29&projectKey=SDAD&view=planning&selectedIssue=SDAD-249&epics=visible&issueLimit=100)

## Set Up
- Using your Operating Systems Terminal set the ExecutionPolicy. Use the command: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser. 
- The RemoteSigned is also a safe PowerShell Execution policy to set in an enterprise environment. This policy dictates that any script that was not created on the system that the script is running on, should be signed. Therefore, this will allow you to write your own script and execute it. You would not be able to run a script that was downloaded from the Internet, or got from a friend who wrote it under his account or on a different computer. PowerShell differentiates between script you wrote on that computer, and a script that came from elsewhere using the file metadata.
- (The scope makes the RemoteSigned only effect a single user instead of allowing all the users to become effected by the terminal command. This is a security precaution.)
- Install <a href = "https://nodejs.org/en">Node.js</a>. and its dependency <a href = "https://community.chocolatey.org/packages/nodejs.install">Chocolatey</a>.
- Initilize the bots project using command npm init -y.
- Install nodemon using the terminal and the command npm install -g nodemon (nodemon installation allows the script to run continuously in the background while also autoupdating anytime script is changed in the bot project and saved allowing all changes to be quickly deployed for the bot).
- Install dotenv on using the terminal and the command npm install dotenv (This causes allows your bot project a place for the bots token to be stored later in the project and then be placed into a gitignore file in order to keep your token and other confidential project information safe if the bot is shared on GitHub.)
- Install discord.js using the terminal and the command npm i discord.js.
- Create a Discord bot on the Discord bot <a href = "https://discord.com/login?redirect_to=%2Fdevelopers%2Fapplications%2F">Discord Developer Portal</a>.
- Add the bot's token (Discord developer Portal-> application-> "specific app"-> bot -> Reset Token)to config.json and adjuste the configuration to indicate where the script is on your local machine.
- Run the bot by using nodemon or nodemon index.js or any other command you prefer. 
