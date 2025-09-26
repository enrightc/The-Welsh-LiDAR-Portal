// src/components/LidarFooter.jsx
import React from "react";

import "../assets/styles/lidar-footer.css";

export default function LidarFooter() {
  return (
    <footer className="lidar-footer" aria-labelledby="footer-heading">

      {/* Decorative illustration */}
      <svg
        className="footer-art"
        viewBox="0 0 1440 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        role="img" aria-label="Stylised hills with Pentre Ifan silhouette"
      >
        <path d="M1440 0H0V210H1440V0Z" fill="url(#paint0_linear_2684_22)"/>
        <path d="M0 190C240 160 520 210 720 180C980 145 1230 200 1440 170V240H0V190Z" fill="#27435C"/>
        <path d="M0 218C220 246 520 228 720 242C980 262 1210 248 1440 276V340H0V218Z" fill="#1E344A"/>

        {/* Subtle tech grid overlay */}
        <g opacity="0.12">
          <pattern id="techGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" stroke="#88AACC" strokeWidth="0.5" />
          </pattern>
          <rect x="0" y="0" width="1440" height="210" fill="url(#techGrid)" />
        </g>

        <path d="M1166.66 110.289C1156.78 111.33 1147.23 112.338 1137.68 113.38C1125.42 114.72 1113.17 116.149 1100.89 117.411C1096.16 117.898 1095.59 118.761 1098.06 122.641C1101.34 127.79 1101.17 133.756 1101.9 139.478C1103.1 148.882 1104.04 158.32 1105.18 167.732C1106.68 180.09 1108.27 192.438 1109.81 204.791C1111.39 217.377 1112.97 229.963 1114.53 242.552C1116.2 255.964 1117.83 269.379 1119.5 282.789C1119.79 285.142 1118.41 285.479 1116.67 285.123C1110.5 283.864 1104.29 282.948 1098.06 282.107C1086.8 280.588 1075.58 280.926 1064.31 281.971C1049.16 283.376 1034.7 287.497 1020.44 292.509C1019.66 292.783 1018.87 293.087 1017.59 292.578C1016.87 289.071 1018.29 285.555 1018.93 282.073C1024.5 251.862 1030.2 221.675 1035.93 191.495C1039.65 171.916 1043.48 152.355 1047.31 132.797C1048.07 128.932 1049.32 125.269 1051.9 122.098C1054.08 119.412 1053.28 117.924 1049.91 117.39C1043.51 116.374 1037.08 116.878 1030.67 116.774C1027.69 116.726 1024.74 116.553 1021.8 116.027C1015.72 114.936 1011.07 110.505 1010.19 104.931C1009.26 98.9851 1011.66 94.3625 1017.75 91.3794C1025.02 87.8178 1032.82 85.5687 1040.43 82.8497C1076.68 69.8843 1112.92 56.8892 1149.25 44.1763C1182.9 32.4061 1216.65 20.9589 1250.37 9.41851C1257.84 6.86535 1265.33 5.71546 1272.96 9.10411C1277.81 11.257 1281.66 14.4466 1284.44 18.9083C1290.97 29.4113 1297.51 39.9154 1303.95 50.4815C1312.63 64.741 1308.37 78.8476 1293.28 86.0307C1284.83 90.0534 1275.58 91.4136 1266.67 93.9156C1263.93 94.686 1261.15 95.3465 1258.37 95.9626C1256.88 96.2925 1255.7 96.9044 1255.08 98.4096C1255.36 99.7805 1256.59 100.25 1257.61 100.674C1265.29 103.877 1268.32 110.169 1269.74 117.873C1273.35 137.465 1277.22 157.008 1280.91 176.586C1286.3 205.257 1291.59 233.949 1296.99 262.618C1299.01 273.341 1301.23 284.026 1303.37 294.725C1305.36 304.666 1312.83 308.074 1321.59 309.731C1326.59 310.678 1331.67 311.233 1336.71 311.97C1337.87 312.14 1339.08 312.202 1340 313.428C1338.99 315.471 1336.9 316.238 1335.09 317.21C1317.17 326.844 1298.05 329.733 1277.85 328.329C1255.54 326.778 1234.59 319.963 1213.57 313.226C1203.84 310.109 1194.16 306.851 1184.45 303.669C1178.49 301.715 1178.28 301.492 1179.36 295.389C1183.53 271.91 1187.79 248.448 1191.94 224.967C1196.82 197.406 1201.61 169.83 1206.47 142.266C1208.24 132.222 1210.08 122.191 1211.93 112.16C1212.78 107.504 1211.57 105.709 1206.95 106.105C1196.79 106.974 1186.65 108.095 1176.53 109.306C1173.35 109.688 1170.08 109.213 1166.66 110.289Z" fill="black"/>

        {/* Subtle glowing nodes */}
        <circle cx="220" cy="80" r="18" fill="url(#circuitGlow)" />
        <circle cx="720" cy="140" r="12" fill="url(#circuitGlow)" />
        <circle cx="1220" cy="100" r="15" fill="url(#circuitGlow)" />

        <defs>
          <linearGradient id="paint0_linear_2684_22" x1="0" y1="0" x2="0" y2="210" gradientUnits="userSpaceOnUse">
            <stop stopColor="#102034"/>
            <stop offset="1" stopColor="#172A44"/>
          </linearGradient>
          <radialGradient id="circuitGlow" cx="0.5" cy="0.5" r="0.8">
            <stop offset="0%" stopColor="#3DD2FF" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>
      </svg>

     

      {/* Footer content */}
      <div className="lidar-footer__content">
        <h2 id="footer-heading" className="sr-only">Site footer</h2>

        <div className="lidar-footer__cols">
          <div>
            <div className="brand">The Welsh LiDAR Portal</div>
            <p className="muted">Explore, record, and share discoveries from LiDAR across Wales.</p>
          </div>

          <nav aria-label="Footer">
            <ul className="links">
              <li><a href="/about">About</a></li>
              <li><a href="/howItWorks">How it works</a></li>
              <li><a href="/LidarPortal">Explore the map</a></li>
            </ul>
          </nav>

          <div>
            <ul className="links">
              <li><a href="/account">Account</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="lidar-footer__bottom">
          <small>© {new Date().getFullYear()} The Welsh LiDAR Portal • Built with Django & React</small>
        </div>
      </div>
    </footer>
  );
}
