# The Welsh LiDAR Portal

Backend Repository [here](https://github.com/enrightc/welsh-lidar-portal-backend)

---

**Explore. Discover. Record.**  
A community-powered platform for discovering and recording archaeological features in Wales using LiDAR data.

---

## 🌍 About the Project

The Welsh LiDAR Portal is the next evolution of [LiDARFind](https://github.com/enrightc/LiDARFind), a project originally built during my Web Application Development Diploma with the Code Institute. While LiDARFind introduced a way for users to record archaeological discoveries on a map using point data, this new version builds on that foundation to create a more powerful, flexible, and collaborative tool.

Wales has some of the most comprehensive LiDAR coverage in the UK, yet existing platforms often don’t let users actively participate in archaeological discovery. This project addresses that by turning passive viewers into engaged contributors.

---

## 🎯 Project Rationale

While several UK platforms let users explore LiDAR data, none focus exclusively on Wales or allow meaningful interaction with the data.

The Welsh LiDAR Portal fills this gap by allowing users to:

- Draw **polygons** to outline features such as barrows, enclosures, field systems, and other complex shapes — not just place points.
- **Record, save, and manage** their discoveries through personalised user profiles.
- **Collaborate** with others by contributing to a shared database of archaeological features.

LiDAR (Light Detection and Ranging) offers detailed insights into the landscape, often revealing features hidden to the naked eye. This makes it an essential tool for both professional archaeologists and curious amateurs.

---

## 💡 Key Features

- 🗺️ **Interactive Map** with Leaflet + React  
  Explore LiDAR data layers and historic features through an intuitive web map interface.

- 🧭 **Polygon Drawing Tool**  
  Use draw tools to map out archaeological features with precision, not just mark locations.

- 🧩 **User Profiles**  
  Log in to save, edit, and manage your own discoveries.

- 📦 **Django Backend with PostgreSQL + PostGIS**  
  Powerful spatial database to handle complex geometries and advanced geospatial queries.

- 🛰️ **Open Data Integration**  
  Uses open LiDAR datasets from trusted sources such as DataMapWales.

- 👥 **Community-Focused**  
  Designed to support citizen scientists, researchers, educators, and heritage groups.

---

## 🌱 Real-World Impact

- **Research & Education**: Helps users discover and interpret previously unrecorded features.
- **Heritage Protection**: Contributes to the monitoring and preservation of vulnerable sites.
- **Public Engagement**: Makes archaeological discovery fun and accessible to all.
- **Planning Support**: Useful for landowners, planners, and conservation professionals.

---

## 🔧 Tech Stack

- **Frontend**: React + Leaflet
- **Backend**: Django + Django REST Framework
- **Database**: PostgreSQL + PostGIS
- **Map Tools**: Leaflet Draw, Cloud-Optimized GeoTIFFs (COGs)
- **Auth**: Django Allauth (planned)
- **Deployment**: To be confirmed (Heroku, Railway, or custom VPS)

---

## 🧑‍🤝‍🧑 Target Audience

The Welsh LiDAR Portal is designed to be inclusive and accessible for everyone — from curious beginners to experienced archaeologists. Whether you're just starting to explore LiDAR data or have years of archaeological research behind you, the platform offers tools that are easy to use and powerful enough to support serious investigation.

---

## 🎯 Project Goals

- Provide a user-friendly platform for recording and sharing archaeological features found through LiDAR analysis across Wales.
- Support collaboration and community involvement in archaeological research and site interpretation.
- Help preserve and better understand the historic environment through the power of citizen science.

---

## 🌟 What Users Can Do

- **Explore and Discover**  
  Browse LiDAR layers to spot hidden features in the Welsh landscape — from ancient field systems to forgotten settlements.

- **Record and Describe**  
  Map out your discoveries using points and polygons, and add notes, interpretations, or images to build a rich record.

- **Learn and Share**  
  Use the platform to expand your understanding of archaeology and share what you’ve found with others.

- **Support Research**  
  Contribute to a growing open dataset that supports both personal and academic research into Wales’ archaeological past.

- **Track Your Journey**  
  Keep a personal collection of your discoveries, revisit sites, and see how your contributions grow over time.

---

## STRUCTURE

### 👥 User Stories

#### As a general user:

- **1.1** I want to quickly understand what The Welsh LiDAR Portal is and how it benefits people like me.
- **1.2** I want to navigate the website easily so I can find the information and tools I need without frustration.
- **1.3** I want the website to work smoothly on all devices, including phones and tablets.

#### As a visitor without an account:

- **2.1** I want to understand the purpose of the website as soon as I land on the homepage.
- **2.2** I want to browse the map and view archaeological discoveries made through LiDAR analysis in Wales.
- **2.3** I want to search and filter discoveries by things like location, feature type, or time period.
- **2.4** I want the option to register for an account so I can start recording my own findings.

#### As a registered user:

- **3.1** I want to securely log into my account to access my profile and saved discoveries.
- **3.2** I want to submit new archaeological features I’ve discovered, using either points or polygons on the map.
- **3.3** I want to edit or delete discoveries I’ve submitted if I need to update or correct them.
- **3.4** I want to log out of my account easily when I’m finished using the site.

#### As an administrator:

- **4.1** I want to manage the database of archaeological discoveries — including the ability to add, edit, or remove entries to maintain data quality.

---

## SKELETON

## Wireframes

<details>
  <summary>Home</summary>
  <img src="/Users/charlie/Documents/GitHub/The-Welsh-LiDAR-Portal/frontend/Readme docs/images/wireframe/Home Page.png" alt="Home page">
</details>

<details>
  <summary>About Page</summary>
  <img src="/Users/charlie/Documents/GitHub/The-Welsh-LiDAR-Portal/frontend/Readme docs/images/wireframe/about.png" alt="about page">
</details>

<details>
  <summary>Explored (not signed in)</summary>
  <img src="/Users/charlie/Documents/GitHub/The-Welsh-LiDAR-Portal/frontend/Readme docs/images/wireframe/Explore Page (Signed out user).png" alt="Explore (Not signed in)">
</details>

<details>
  <summary>Explore (Signed in)</summary>
  <img src="/Users/charlie/Documents/GitHub/The-Welsh-LiDAR-Portal/frontend/Readme docs/images/wireframe/Explore Page (Signed in user).png" alt="Explore (Sign in)">
</details>

## 🚧 Project Status

- [x] Basic project scaffold
- [x] Frontend setup
- [x] Map layers integration (LiDAR)
- [x] Backend setup
- [ ] Connecting Django and React
- [ ] PostgreSQL/PostGIS setup
- [ ] User authentication and profile system
- [ ] Polygon drawing and submission form frontend
- [ ] Deployment
- [ ] Feature detail and editing

---

## 💬 Contributing

This project is still in development, but contributions, feedback, and testing are very welcome!  
Please feel free to [open an issue](#) or [start a discussion](#) if you'd like to get involved.

---

## 📜 License

MIT License — Free to use, modify, and share.
