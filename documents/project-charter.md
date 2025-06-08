___

# <div align="center"> Project Charter</div>


> [!NOTE]
> The project Charter intends to summarise all the understandings and key information accumulated prior to starting the development of the product. It was signed by the customer and ensured that the development started on shared observations and understandings. It doesn't intend to detail the product as much as specifications would. Due to the iterative nature of the project, it isn't a perfect reflection of the final product.

> [!IMPORTANT]
> This document has been anonymised in order to comply with the customer's demands regarding the publication of source code and documents on a publicly accessible repository.

___


<details>
<summary><em>Click to expand table of contents...</em></summary>

- [Main Objectives](#main-objectives)
- [Problem Statement](#problem-statement)
- [Stakeholders](#stakeholders)
- [Project Scope](#project-scope)
- [Success Criteria](#success-criteria)
- [Methodology](#methodology)
- [Milestones](#milestones)
- [Deliverables](#deliverables)
- [Allocated Resources](#allocated-resources)
- [Risk Management](#risk-management)
  - [Known Constraints](#known-constraints)
  - [Known Risks](#known-risks)
- [Glossary](#glossary)

</details>

___


### Main Objectives

There are two main objectives to this project:
- Solve a concrete problem for the customer: Stock shortages and surplus, due to misuse of existing tools and data.
- Validate the first part of my diploma.

### Problem Statement

The Company, based in Mauritius, which manages several home improvement stores abroad, has identified that a software in their toolchain, developed in-house, specifically tailored for reducing shortages/surpluses, is at the heart of a series of events that have conducted one or more stores to run out of annual budget quickly after the year began, for two years in a row.

### Stakeholders

| Developer/Project Owner | User/Supervisor | Validator | Consultants | Secondary Users |
|---|---|---|---|---|
| Mathis KAKAL (Me) | Storemanager-A | CEO | Storemanager-B, Storemanager-C, Accountant | *other store manager assistants* |

### Project Scope

> [!NOTE]
> Elements in "Won't Have" category are definitively excluded for this iteration of the product, but are considered for further ones.

| Must Have | Should Have | Could Have | Won't Have |
|---|---|---|---|
| • Application for setting minimum and maximum order thresholds that allows to look at the most store manager's preferred data to make informed decisions for each SKU.[^1] | • System provides actual adjustment recommendations (increase or decrease) | • Data visualisation on select/most important metrics to ease the eye. The goal is to allow to make quicker judgments and having less eye fatigue at the end of the day. | • Complete ERP suite that would fix problems tied to the current one. |
| • No automatic proposition for adjusting the thresholds, but detection of the necessity to adjust them, based on 4 scenarios : Surplus, Sales improvement, New product, Shortage alert. | • Have an history of all the past decisions to be able to improve judgment over time (and train an ai afterwards) | • Ability to authentify users, allowing for role based access control. | • Tackling infrastructure problems (underpowered server, synchronous nature of apps which doesn't go well with the overall latency, network/VPN problems etc.) |
| • Displayed SKUs will be a restrained to a specific subset of all store SKUs: Only SKUs for store A, of which only those who come from European suppliers, of which only those that represent the 20% in quantity that make up 80% of the sales in quantity, of which only the articles that are in "Permanent" or "New" mode, as the other modes don't require automatic resupplying. This amounts to ~~1000 SKUs. | • Notify resuppliers automatically of any threshold changes, once a week. | • "Duolingo mode" Automatic sorting of SKUs by importance, by weighing different criteria. SKUs would be sorted by most urgent first, and users would only have to take care of the first items to always be working on what is important. | • AI-powered solution that takes automatically sets the thresholds. |
| • Generates an excel file in Min/Max format, so that it doesn't disrupt the current threshold updating process, which is crucial to ensure database integrity. | • Improvement of search to include all or most relevant data | • Customising the interface (once testing has extended to other store managers) to take into account different methodologies. | • Solution that is adapted to all of the Stores upon initial releases. |
| • Basic column sorting (ascending or descending) and search by SKU and supplier. | | • Gamification elements, such as notifications/reminders and "visual accomplishments feedback" to encourage averaging out the setting of the thresholds throughout the year, rather than all at once. | |
| • Config-based interface, however, no config tool, therefore interface isn't customisable yet. | | • Built-in feedback form to support the rapid iteration process and to allow users to directly submit tickets for feature improvements, bugs or simple requests through the app interface. | |

### Success Criteria

There are three timeframes to consider the success and reach of this mission:

- End of June:
    - Understanding of the tool and Reorder Level[^2] process by the whole supply team, including store managers.
    - Full adoption of the RexMax tool and frequent use (thanks to co-creation, UX approach/design thinking)
    - Provide more insight on all the relevant figures to ease the min/max setting process.
    - Allow the shop to go through the crucial July/august period serenely.
- End of the year:
    - Noticeable decrease of shortages and surpluses in the 20% of products that make up 80% of the sales.
    - Extend the tool to other stores.
- Long term (2026 and beyond...)
    - Substantial decrease of the shortages/surpluses on the entirety of the store for new and permanent SKUs, for all the 7+ stores.
    - Allow a uniformisation of processes across all stores, and pave the way for consolidation of the buying function[^3].

### Methodology

![Project Planning](https://github.com/user-attachments/assets/2388c303-107f-4d9a-b584-e63c41adb5ce)

- 30 days of learning, of which:
    - 8 days of professional training,
    - 5 days of machine learning courses,
    - 14 days of autonomous learning on supply chain and inventory management.
    - 3 days at the SITL (International Logistics Convention)
- 1 month of exploration/discovery
- 1 month of development (until June 20th) in 6 sprints of one week each, days of 10 a.m. until 7 p.m., 6 days a week. Due to stakeholder availability, only one sprint meeting will be held per week, which will summarise previous week achievements, and goals for ongoing week.
- 2 weeks of alpha testing (only one user).
- 6 months of beta testing (with a full day of development per week)
- Full release by January 2026, (all it means is that further interventions won't be part of the "package").
- Util then, a same day answer to requests, and same week intervention for less important tasks, but up to same day intervention for more urgent ones.

### Milestones

|Milestone|Date|
|:-:|:-:|
|Project Kickoff: |2025-04-14 Mon|
|Stakeholder alignment meeting: |2025-04-29 Tue|
|Project Charter approval meeting: |2025-05-08 Thu|
|Sprint Meeting 1: |2025-05-16 Fri|
|Sprint Meeting 2: |2025-05-19 Mon|
|Sprint Meeting 3: |2025-05-26 Mon|
|Sprint Meeting 4: |2025-06-02 Mon|
|Jury Version Delivery |2025-06-08 Sun|
|Sprint Meeting 5: |2025-06-09 Mon|
|Sprint Meeting 6: |2025-06-16 Mon|
|MVP[^4] Delivery, begin Alpha Tests: |2025-06-20 Fri|
|Begin Beta Tests: |2025-06-30 Mon|
|1.0.0 Full Release Delivery: |2025-12-31 Wed|

### Deliverables

- Windows Electron[^5] desktop application (.exe executable) software along with its user manual, accurately describing its functioning. Fully tested for Windows ≥ 22H2.
- Project Charter.
- Product Specifications (User/Business/Functional/Technical/Quality Requirements)
- Training session with end users. Group presentation then one to one training.
- Private GitHub Repository access with automatic build scripts to support rapid iteration and continuous improvement, with the last release always available in the release section. Use of GitHub Issues as tickets for features, bugs etc.

### Allocated Resources

- It was well noted that given the current constraints (very slow, saturated, unstable network) an app that would pull the data only once in the morning and store all the data in a local sqlite database to perform all operations on it. Therefore, app will be hosted on the computers of the end users, without any connection to other services, with the exception of GitHub for issues, the live database for fetching the latest SKU data, and probably some telemetry later on.
- The rapid iteration process requires high availability from end users to maintain a short feedback loop. The end user has accepted this constraint and will be available to perform tests daily to support continuous improvement.
No additional/hidden costs have been found to ensure the mission's success.

### Risk Management

#### Known Constraints

- 1 month of development is very short, especially considering that I am not a big fan of building prototypes "that just work", rather than robust foolproof products.
- I have never really used excel or sheets.
- Very unstable network. Cannot rely on frequent database connections. It is  discouraged to interact with the live database during working hours, but the database is also closed when the store closes (service level agreement). This only leaves two one hour timeframes to work with it throughout the day.

#### Known Risks

| **Risk** | **Mitigation** |
|---|---|
| The application is not finished on time | Focus on a feasible MVP and split the work as much as possible; stay in close contact with the client to pivot quickly if something unexpected happens; commit to continuing improvements until the end of 2026. Use short, iterative development cycles to respond rapidly to issues—greater agility overall. |
| The application is not adopted by its users | Previous roll-outs showed that understanding and uptake are the main friction points. Full-time dedication to user training, feedback-driven iteration, and active listening to user needs should solve this. As an external consultant, I can take on that full-time role. |
| The application slows the computer / consumes too many resources | The target environment has been carefully replicated for development, and milestone builds will be tested on that environment to avoid conflicts with other software or performance drops. |
| The application saturates bandwidth already loaded by the PoS[^6] terminals and central database | The app will work from a daily ad-hoc database copy (just like the reorder-level tool), so it will not stress the production DB. LAN/Wi-Fi impact will be measured and tuned to stay no heavier than the many dynamic Excel files staff already use. A local data cache will prevent refreshes on every launch (accounting data update only once a day). All processing is local, so the network is touched only once per day. The output file with adjusted min/max levels will be only a few hundred KB — negligible traffic. |
| The application introduces security vulnerabilities on the host machines | Electron’s stack does have a larger attack surface (Chromium, full Node.js, third-party npm packages). However, its popularity and open-source nature mean it is actively maintained and audited. I will follow the official hardening guidelines and, whenever possible, deploy only binaries built with the latest Electron version and dependencies. |
| The application produces results that pollute the database | The goal is to fill missing min/max data that drive the reorder-level system. Because Mauritian logistics have 3-month lead times, impacts can be felt too late. Deployment will therefore be long and gradual, with several test phases before touching the live min/max table: **(1)** view min/max values for manual edits, **(2)** generate an adjustment file, **(3)** make direct updates once user confidence is high. A hard deadline exists: the system must be “back on course” by early July to protect year-end revenue, placing the end of alpha testing on 31 June and leaving just over two weeks to iterate after the MVP. Method and rigor will be critical. |
| The SKUs corrected by the application fail to reduce stock-outs | Ensure the automatic categorization (AA) process works correctly; without it, the most critical products cannot be targeted. |


# Glossary

[^1]: SKU stands for Stock Keeping Unit, it is basically a unique item, usually identified by a unique identifier, like a barcode for instance.

[^2]: Reorder Level is the name given internally to the process of finding all the SKUs that are about to go on shortage, takes into account the needs of all the stores, the order minimums and other factors to come up with order suggestion that try to satisfy several criteria. A more appropriate name would be: "Automatic Order Suggestion System". It is called Reorder Level, since the initial trigger is the Reorder point of an SKU 

[^3]: As the number of store grows, it makes more and more sense to have a central warehouse that aims to consolidate orders to take advantage of economies of scale, simplified logistics and easier to anticipate delays and inventories.

[^4]: Stands for Minimum Viable Product. It is the simplest version of a product that can be released to users while still delivering enough value to be useful or solve a core problem, collect feedback for improvement & test assumptions.

[^5]: A technology that allows to deploy web code as standalone desktop applications by bundling them in a chromium browser.

[^6]: Stands for Point of Sale. Refers to the devices generally used by cashiers to register sales and which updates the register/inventory everytime that happens, therefore potentially saturating the network.
