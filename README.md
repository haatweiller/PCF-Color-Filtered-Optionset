# Color Filtered Optionset - Power Apps Dataverse Field Component
PCF to filter Dataverse Optionset by option color.

## Optionset configuration
![image](https://user-images.githubusercontent.com/5312410/224936282-c6dcf60a-8865-41f3-965f-2827b55d8cb8.png)
This global Choice has 6 options with 3 different color configurations. Red has hex value #ff0000 and blue has hex value #0000ff
![image](https://user-images.githubusercontent.com/5312410/224936467-76925998-2690-4659-9630-b5a16201cf3b.png)
![image](https://user-images.githubusercontent.com/5312410/224936525-2b0ecd1c-36c3-45e5-8d76-a89974b8b306.png)

## Component configuration
Add the component to your optionset and configure it. There are 4 options on the behavior; hide options with no color, hide option with any color, hide a specific color, and show a specific color.

| Setting | Description |
|---------|-------------|
| Value | Column to where the component is bound to |
| Hide/Show setting | The 4 behavior options |
| Which specific color to hide/show | The hex value of the color that either needs to be filtered out or shown. Needs to be provided in the HTML Hex value e.g. '#ff0000'. This value is in the Choice configuration |

### Hide Options With No Color
![image](https://user-images.githubusercontent.com/5312410/224937170-5338a2ca-de26-47f4-9ab4-bd2de05588d6.png)
![image](https://user-images.githubusercontent.com/5312410/224937197-1d361d70-fee0-4c2e-a855-0b3070f17afe.png)

### Hide Options With Any Color
![image](https://user-images.githubusercontent.com/5312410/224937316-24dee13a-c234-4b74-bc9c-117bbec5e8e1.png)
![image](https://user-images.githubusercontent.com/5312410/224937343-1b4b4529-ab17-473e-be39-1879324fcf1c.png)

### Hide Options With a Specific Color
![image](https://user-images.githubusercontent.com/5312410/224937448-6b8de365-2874-4582-9a1c-f1c93614dcb7.png)
![image](https://user-images.githubusercontent.com/5312410/224937477-d9a39b99-416c-441b-8294-a1bef8241187.png)

### Show Options With a Specific Color
![image](https://user-images.githubusercontent.com/5312410/224937558-2ac59121-d5c4-46eb-8590-d4f42d19a873.png)
![image](https://user-images.githubusercontent.com/5312410/224937569-7d2d194e-b22d-4e06-9833-800deb0ff6ae.png)
